"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Crown } from "lucide-react";
import Navbar from "../_component/Navbar";
import Footer from "../_component/Footer";

const VALID_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function Landing() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("guest");

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan || "guest"))
      .catch(() => {});
  }, []);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    setError("");
    setFile(null);

    if (!selected) return;

    if (!VALID_TYPES.includes(selected.type)) {
      setError("Invalid file type. Please upload a PDF or DOCX file.");
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        router.push("/login?next=/upload");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      // Analysis results are passed to /analysis via sessionStorage to avoid huge URLs.
      sessionStorage.setItem("achivai_result", JSON.stringify(data));
      router.push("/analysis");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar logoColor="#ffffff" buttonColor="#0000ff" scrollBgColor="#000000" />

      <div
        className="min-h-[86vh] flex items-center justify-center px-4 sm:px-6 md:px-10 py-10"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,1) 100%),
            radial-gradient(ellipse at bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,1) 70%)
          `,
          backgroundColor: "#000"
        }}
      >
        <div className="
          w-full max-w-5xl 
          border josefin-sans border-black 
          rounded-[30px] sm:rounded-[40px] 
          p-6 sm:p-10 md:p-12 
          relative overflow-hidden  
          bg-white/10 backdrop-blur-sm
        ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-white leading-tight">
            Stop Applying. Start <span className="underline">Getting Hired.</span>
          </h1>

          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
            Our AI instantly scans, optimizes, and tailors your resume to beat the ATS and match the job description every time.
          </p>

          {plan === "free" && (
            <div className="w-full max-w-2xl mx-auto mb-6 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-2.5 px-4">
              <Crown className="h-4 w-4 text-amber-400" />
              <p className="text-xs sm:text-sm text-gray-200">
                Free plan: <span className="font-semibold">2 AI analyses/month</span>.{" "}
                <Link href="/pricing" className="text-amber-300 underline hover:text-amber-200">
                  Upgrade to Premium
                </Link>{" "}
                for unlimited analysis.
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="
              w-full 
              max-w-2xl mx-auto 
              rounded-2xl bg-gray-100 border border-gray-400 
              flex flex-col items-center gap-3 p-5
            "
          >
            <label className="px-5 py-2.5 sm:px-6 sm:py-3 bg-black text-white rounded-md shadow cursor-pointer transition transform hover:scale-105 hover:bg-gray-700 text-sm sm:text-base">
              Upload Your Resume
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
            </label>

            {loading && <p className="text-sm text-blue-600">Analyzing with AI...</p>}
            {!loading && file && (
              <p className="text-sm text-gray-800 break-all px-4 text-center">Selected: {file.name}</p>
            )}

            <div className="w-full max-w-xl text-left">
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Optional: Paste a job description for better keyword matching
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="e.g. 'Seeking a Senior React Developer with 5+ years experience in TypeScript, Next.js, AWS...'"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            {file && !loading && (
              <button
                onClick={handleAnalyze}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition text-sm font-medium"
              >
                Analyze with AI
              </button>
            )}

            {error && (
              <p className="text-sm text-red-600 font-medium text-center px-4 break-words max-w-xl">{error}</p>
            )}

            {!error && !file && (
              <p className="text-xs font-bold text-gray-600">**PDF or DOCX only, max 5MB**</p>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}