"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowLeft,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import Navbar from "../_component/Navbar";

function ScoreRing({ score }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Needs Work" : "Weak";

  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">{score}</span>
        <span className="text-xs font-medium text-slate-500">ATS Score</span>
      </div>
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </div>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [result, setResult] = useState(() => {
    try {
      const raw = sessionStorage.getItem("achivai_result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!result) router.replace("/upload");
  }, [result, router]);

  const sectionEntries = useMemo(() => {
    const s = result?.sectionsAnalyzed || {};
    return Object.entries(s).filter(([, v]) => v && String(v).trim());
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  const matched = result.matchedKeywords || [];
  const missing = result.missingKeywords || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar logoColor="#021F81" buttonColor="#021F81" scrollBgColor="rgba(255,255,255,0.95)" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pt-28">
        <button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Analyze another resume
        </button>

        {/* Header + score */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={result.atsScore} />

          <div className="text-center sm:text-left">
            {result.suggestedRole && (
              <p className="text-sm font-medium text-blue-600 mb-1">
                Target role: {result.suggestedRole}
              </p>
            )}
            <h1 className="text-2xl font-bold text-slate-900">
              Your ATS Readiness Report
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              {result.feedback || "No overall feedback returned."}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {matched.length} matched
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <XCircle className="h-3 w-3" /> {missing.length} missing
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" /> Keywords
            </h2>

            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Present in your resume
            </p>
            {matched.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {matched.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-6">No keywords matched.</p>
            )}

            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Missing — add these
            </p>
            {missing.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missing.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-600">
                Great — no critical missing keywords!
              </p>
            )}
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Improve your resume
            </h2>

            {result.suggestions.length > 0 ? (
              <ol className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-400">No suggestions returned.</p>
            )}

            <Link
              href="/template"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Rebuild with an AchiVAI template
            </Link>
          </div>
        </div>

        {/* Section feedback */}
        {sectionEntries.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              Section-by-section feedback
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sectionEntries.map(([section, text]) => (
                <div
                  key={section}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    {section}
                  </p>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}