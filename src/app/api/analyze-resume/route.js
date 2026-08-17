import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText } from "../../../lib/fileParsers";
import { buildAnalysisPrompt } from "../../../lib/prompt";
import { createServerSupabaseClient } from "../../../lib/supabaseServer";
import { FREE_MONTHLY_LIMIT } from "../../../lib/razorpayServer";

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

    if (!file || !(file instanceof File)) {
      return json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!VALID_TYPES.includes(file.type)) {
      return json({ error: "Invalid file type. Upload a PDF or DOCX." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return json({ error: "File is too large. Maximum size is 5MB." }, { status: 400 });
    }

    const resumeText = await extractText(file, file.type);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(
      buildAnalysisPrompt({ resumeText, jobDescription })
    );

    const raw = result.response.text();

    let analysis;
    try {
      analysis = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      analysis = match ? JSON.parse(match[0]) : null;
    }

    if (!analysis || typeof analysis.atsScore !== "number") {
      return json(
        { error: "Could not parse the AI analysis. Please try again." },
        { status: 500 }
      );
    }

    // Record usage for free users so the quota actually counts.
    if (!isPremium) {
      await supabase
        .from("usage_events")
        .insert({ user_id: user.id, kind: "analysis" });
    }

    return json({ ...normalize(analysis), jobDescription, plan: isPremium ? "premium" : "free" });
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
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
}