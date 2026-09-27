import { NextResponse } from "next/server";
import { verifyGithubRepo } from "../../../lib/githubVerifier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { githubUrl, resumeText = "", candidateSkills = [] } = await request.json();

    if (!githubUrl || typeof githubUrl !== "string") {
      return NextResponse.json(
        { error: "GitHub repository URL is required." },
        { status: 400 }
      );
    }

    const verification = await verifyGithubRepo(githubUrl, resumeText, candidateSkills);

    if (verification?.error) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    return NextResponse.json(verification);
  } catch (err) {
    console.error("verify-repo error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to inspect repository." },
      { status: 500 }
    );
  }
}
