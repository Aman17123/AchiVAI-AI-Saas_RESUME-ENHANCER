export function buildAnalysisPrompt({ resumeText, jobDescription }) {
  const jdSection = jobDescription
    ? `\nJOB DESCRIPTION:\n${jobDescription}`
    : "";

  return `You are an expert ATS (Applicant Tracking System) resume reviewer.

Analyze the resume${jdSection ? " against the job description" : " and infer the target role from its content"}.

${jdSection}

RESUME:
${resumeText}

Return STRICT JSON only (no markdown, no commentary) with exactly this shape:
{
  "atsScore": number between 0 and 100,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionsAnalyzed": {
    "Summary": "1-2 sentence feedback",
    "Experience": "1-2 sentence feedback",
    "Education": "1-2 sentence feedback",
    "Skills": "1-2 sentence feedback",
    "Projects": "1-2 sentence feedback"
  },
  "feedback": "2-3 sentence overall assessment",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3", "actionable suggestion 4", "actionable suggestion 5"],
  "suggestedRole": "the job title the resume seems to target (or best guess)"
}

Rules:
- atsScore must be an integer 0-100. Score lower if contact info is missing, no quantified achievements, weak action verbs, or keyword gaps vs the job description.
- matchedKeywords: keywords present in BOTH resume and job description (or strong keywords found in the resume if no JD given).
- missingKeywords: important keywords from the job description missing from the resume. If no JD given, list industry-standard keywords a recruiter would expect for the target role.
- Be specific and professional. Never invent facts about the candidate.`;
}