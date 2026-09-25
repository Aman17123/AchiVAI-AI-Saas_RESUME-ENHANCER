import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabaseClient } from "../../../lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is not configured." }, { status: 500 });
    }

    // Auth check
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Please sign in to use AI enhancement." }, { status: 401 });
      }
    }

    const body = await request.json();
    const { field, value, name, title } = body;

    if (!field || !value || !value.trim()) {
      return NextResponse.json({ error: "No content to enhance." }, { status: 400 });
    }

    const prompts = {
      summary: `You are a professional resume writer and career coach.
Rewrite the following professional summary for ${name || "a job seeker"}${title ? ` applying for a ${title} role` : ""}.
Make it:
- ATS-optimized with strong action verbs and relevant keywords
- Concise (3-4 sentences, 60-80 words)
- Achievement-oriented and specific
- Professional and confident in tone

Original summary:
${value}

Return ONLY the improved summary text, no explanations or labels.`,
    };

    const prompt = prompts[field] || prompts.summary;

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"];
    let enhanced = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
        });
        const result = await model.generateContent(prompt);
        enhanced = result.response.text().trim();
        if (enhanced) break;
      } catch (err) {
        lastError = err;
        console.warn(`[enhance-resume] Model ${modelName} failed:`, err.message);
      }
    }

    if (!enhanced) {
      throw lastError || new Error("All models failed.");
    }

    return NextResponse.json({ enhanced });
  } catch (err) {
    console.error("enhance-resume error:", err);
    return NextResponse.json(
      { error: err.message || "AI enhancement failed. Please try again." },
      { status: 500 }
    );
  }
}
