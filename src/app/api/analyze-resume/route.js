import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText } from "../../../lib/fileParsers";
import { buildAnalysisPrompt } from "../../../lib/prompt";
import { createServerSupabaseClient } from "../../../lib/supabaseServer";
import { FREE_MONTHLY_LIMIT } from "../../../lib/razorpayServer";
import { analyzeAtsXRay } from "../../../lib/atsEngineSimulator";
import { verifyGithubRepo } from "../../../lib/githubVerifier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json(
        { error: "AI service is not configured. Add GEMINI_API_KEY to continue." },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return json(
        { error: "Authentication is not configured on this server." },
        { status: 500 }
      );
    }

    // ---- Auth + quota enforcement ----
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return json(
        { error: "Please sign in to analyze your resume." },
        { status: 401 }
      );
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const isPremium = sub?.plan === "premium" && sub?.status === "active";

    if (!isPremium) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("kind", "analysis")
        .gte("created_at", startOfMonth.toISOString());

      if ((count || 0) >= FREE_MONTHLY_LIMIT) {
        return json(
          {
            error: `Free plan limit reached (${FREE_MONTHLY_LIMIT} analyses/month). Upgrade to Premium for unlimited AI analysis.`,
            plan: "free",
          },
          { status: 402 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const jobDescription = (formData.get("jobDescription") || "")
      .toString()
      .trim();
    const githubUrl = (formData.get("githubUrl") || "")
      .toString()
      .trim();

    if (!file || !(file instanceof File)) {
      return json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!VALID_TYPES.includes(file.type)) {
      return json({ error: "Invalid file type. Upload a PDF or DOCX." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return json({ error: "File is too large. Maximum size is 5MB." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractText(file, file.type);

    // Parallel analysis: Run ATS X-Ray and LLM analysis concurrently
    const [atsXRayResult, aiAnalysisResult] = await Promise.allSettled([
      analyzeAtsXRay(fileBuffer, file.type, file.name),
      (async () => {
        const prompt = buildAnalysisPrompt({ resumeText, jobDescription });
        const groqKey = process.env.GROQ_API_KEY || (apiKey.startsWith("gsk_") ? apiKey : null);

        // 1. Prioritize Groq if groq key is detected (ultra-fast & high reliability)
        if (groqKey) {
          const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
          for (const model of groqModels) {
            try {
              const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${groqKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model,
                  response_format: { type: "json_object" },
                  messages: [{ role: "user", content: prompt }],
                  temperature: 0.2,
                }),
              });

              if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                  return JSON.parse(content);
                }
              }
            } catch (err) {
              console.warn(`Groq model ${model} failed, trying next:`, err.message);
            }
          }
        }

        // 2. Google Gemini if non-gsk key is available
        const geminiKey = process.env.GEMINI_API_KEY?.startsWith("gsk_") ? null : process.env.GEMINI_API_KEY;
        if (geminiKey) {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const candidateModels = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
          let lastError = null;

          for (const modelName of candidateModels) {
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                const model = genAI.getGenerativeModel({
                  model: modelName,
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.4,
                  },
                });

                const result = await model.generateContent(prompt);
                if (result) {
                  const raw = result.response.text();
                  try {
                    return JSON.parse(raw);
                  } catch {
                    const match = raw.match(/\{[\s\S]*\}/);
                    return match ? JSON.parse(match[0]) : null;
                  }
                }
              } catch (err) {
                lastError = err;
                const isTransient =
                  err.message?.includes("503") ||
                  err.message?.includes("high demand") ||
                  err.message?.includes("429");

                if (isTransient && attempt === 0) {
                  await new Promise((r) => setTimeout(r, 1500));
                  continue;
                }
                break;
              }
            }
          }
          if (lastError) throw lastError;
        }

        throw new Error("Unable to complete AI analysis. Please verify your API key.");
      })(),
    ]);

    if (aiAnalysisResult.status === "rejected" || !aiAnalysisResult.value) {
      const originalErr = aiAnalysisResult.reason?.message || "";
      if (originalErr.includes("503") || originalErr.includes("high demand")) {
        throw new Error(
          "Google AI servers are experiencing a temporary traffic spike. Please wait 10 seconds and click 'Analyze with AI' again."
        );
      }
      throw aiAnalysisResult.reason || new Error("Could not parse AI analysis.");
    }

    const analysis = aiAnalysisResult.value;
    const atsXRay = atsXRayResult.status === "fulfilled" ? atsXRayResult.value : null;

    // Run GitHub Proof-of-Work Verifier if URL provided
    let powVerification = null;
    if (githubUrl) {
      try {
        powVerification = await verifyGithubRepo(
          githubUrl,
          resumeText,
          analysis.matchedKeywords || []
        );
      } catch (err) {
        console.warn("PoW verification failed:", err.message);
      }
    }

    // Record usage for free users so the quota actually counts.
    if (!isPremium) {
      await supabase
        .from("usage_events")
        .insert({ user_id: user.id, kind: "analysis" });
    }

    return json({
      ...normalize(analysis),
      jobDescription,
      githubUrl,
      resumeRawSnippet: resumeText.slice(0, 1000),
      atsXRay,
      powVerification,
      plan: isPremium ? "premium" : "free",
    });
  } catch (err) {
    console.error("analyze-resume error:", err);
    return json(
      {
        error:
          err.message ||
          "Analysis failed. This usually means rate-limit exceeded or the Gemini API key is invalid.",
      },
      { status: 500 }
    );
  }
}

function normalize(a) {
  return {
    atsScore: Math.max(0, Math.min(100, Math.round(a.atsScore))),
    matchedKeywords: Array.isArray(a.matchedKeywords) ? a.matchedKeywords : [],
    missingKeywords: Array.isArray(a.missingKeywords) ? a.missingKeywords : [],
    sectionsAnalyzed: a.sectionsAnalyzed || {},
    feedback: a.feedback || "",
    suggestions: Array.isArray(a.suggestions) ? a.suggestions : [],
    suggestedRole: a.suggestedRole || "",
  };
}

function json(body, init) {
  return NextResponse.json(body, init);
}