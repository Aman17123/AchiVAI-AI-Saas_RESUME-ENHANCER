"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Crown, Upload, FileText } from "lucide-react";
import Navbar from "../_component/Navbar";
import Footer from "../_component/Footer";

const VALID_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/** Full-screen modal shown while the AI is crunching the resume */
function AnalyzingModal() {
  const steps = [
    "Reading your resume...",
    "Scanning keywords & ATS signals...",
    "Matching against job description...",
    "Generating smart suggestions...",
    "Almost done...",
  ];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      key="analyzing-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 rounded-2xl bg-white px-10 py-10 text-center"
        style={{
          width: 360,
          maxWidth: "90vw",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Clean SVG spinner */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="16" stroke="#e5e7eb" strokeWidth="3" />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            stroke="#111827"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset="75"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
            style={{ transformOrigin: "20px 20px" }}
          />
        </svg>

        {/* Heading + animated step */}
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-[15px] font-semibold text-gray-900"
            style={{ letterSpacing: "-0.01em" }}
          >
            Analyzing your resume
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-gray-400"
            >
              {steps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Thin progress bar */}
        <div
          className="w-full overflow-hidden rounded-full"
          style={{ height: 3, backgroundColor: "#f3f4f6" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "#111827" }}
            initial={{ width: "6%" }}
            animate={{ width: `${Math.round(((stepIndex + 1) / steps.length) * 80) + 8}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <p className="text-xs text-gray-400">Usually takes 10–20 seconds</p>
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("guest");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan || "guest"))
      .catch(() => {});
  }, []);

  const handleFile = (selected) => {
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

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
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

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("The server returned an unexpected response. Please try again.");
      }

      if (!res.ok) throw new Error(data?.error || "Analysis failed");

      sessionStorage.setItem("achivai_result", JSON.stringify(data));
      router.push("/analysis");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong. Please try again.");
    }
    // Note: we don't setLoading(false) on success because we navigate away.
  };

  return (
    <>
      <AnimatePresence>{loading && <AnalyzingModal />}</AnimatePresence>

      <Navbar logoColor="#ffffff" buttonColor="#0000ff" scrollBgColor="#000000" />

      <div
        className="min-h-[86vh] flex items-center justify-center px-4 sm:px-6 md:px-10 py-10"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,1) 100%),
            radial-gradient(ellipse at bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,1) 70%)
          `,
          backgroundColor: "#000",
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
            className="w-full max-w-2xl mx-auto rounded-2xl bg-gray-100 border border-gray-400 flex flex-col items-center gap-4 p-5"
          >
            {/* Drag & drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="w-full flex flex-col items-center gap-3"
            >
              <label
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-8 px-4"
                style={{
                  borderColor: dragOver ? "#6366f1" : file ? "#22c55e" : "#9ca3af",
                  backgroundColor: dragOver ? "rgba(99,102,241,0.05)" : file ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.6)",
                }}
              >
                {file ? (
                  <>
                    <FileText size={32} className="text-green-500" />
                    <p className="text-sm font-semibold text-green-700">Resume uploaded!</p>
                    <p className="text-xs text-gray-600 break-all text-center px-2">{file.name}</p>
                    <p className="text-xs text-gray-400">Drag a new file or click to replace</p>
                  </>
                ) : (
                  <>
                    <Upload size={32} style={{ color: dragOver ? "#6366f1" : "#6b7280" }} />
                    <p className="text-sm font-semibold text-gray-700">
                      {dragOver ? "Drop it here!" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-gray-500">PDF or DOCX — max 5 MB</p>
                  </>
                )}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleInputChange} />
              </label>
            </div>

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

            {file && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-md cursor-pointer transition text-sm font-semibold"
              >
                Analyze with AI
              </button>
            )}

            {error && (
              <p className="text-sm text-red-600 font-medium text-center px-4 break-words max-w-xl">
                {error}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}