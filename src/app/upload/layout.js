export const metadata = {
  title: "Free ATS Resume Checker — Upload & Analyze Your Resume",
  description:
    "Upload your resume (PDF or DOCX) and get an instant ATS score out of 100, missing keyword list, and AI-powered feedback. Free, no sign-up required.",
  alternates: { canonical: "/upload" },
  keywords: [
    "ATS resume checker",
    "resume score checker",
    "ATS score",
    "upload resume for analysis",
    "check resume against job description",
    "free ATS checker",
    "resume keyword scanner",
  ],
  openGraph: {
    title: "Free ATS Resume Checker — AchiVAI",
    description:
      "Get an instant ATS score and AI feedback on your resume. Upload PDF or DOCX — free and instant.",
  },
  robots: { index: true, follow: true },
};

export default function UploadLayout({ children }) {
  return children;
}