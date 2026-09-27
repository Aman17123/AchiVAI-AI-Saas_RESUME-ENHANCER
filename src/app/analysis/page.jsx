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
  ScanSearch,
  Terminal,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  FileCode,
  Layers,
  Cpu,
  Check,
  Copy,
  Info,
  Sparkles,
} from "lucide-react";
import Navbar from "../_component/Navbar";

function ScoreRing({ score, label = "ATS Score", size = 160 }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const filled = (safeScore / 100) * circumference;

  const color =
    safeScore >= 80 ? "#22c55e" : safeScore >= 60 ? "#eab308" : "#ef4444";
  const statusLabel =
    safeScore >= 80 ? "Excellent" : safeScore >= 60 ? "Moderate" : "At Risk";

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="11"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{safeScore}</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {statusLabel}
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

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "xray" | "pow"
  const [streamMode, setStreamMode] = useState("linear"); // "linear" | "spatial"
  const [copiedStream, setCopiedStream] = useState(false);

  // Proof-of-work state
  const [powData, setPowData] = useState(result?.powVerification || null);
  const [repoInput, setRepoInput] = useState(result?.githubUrl || "");
  const [isVerifyingRepo, setIsVerifyingRepo] = useState(false);
  const [repoError, setRepoError] = useState("");

  useEffect(() => {
    if (!result) router.replace("/upload");
  }, [result, router]);

  const sectionEntries = useMemo(() => {
    const s = result?.sectionsAnalyzed || {};
    return Object.entries(s).filter(([, v]) => v && String(v).trim());
  }, [result]);

  const handleVerifyRepo = async (e) => {
    e?.preventDefault();
    if (!repoInput.trim()) return;

    setIsVerifyingRepo(true);
    setRepoError("");

    try {
      const res = await fetch("/api/verify-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl: repoInput.trim(),
          resumeText: result?.resumeRawSnippet || "",
          candidateSkills: result?.matchedKeywords || [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to inspect repository.");

      setPowData(data);
      // Persist in session storage
      const updatedResult = { ...result, powVerification: data, githubUrl: repoInput.trim() };
      setResult(updatedResult);
      sessionStorage.setItem("achivai_result", JSON.stringify(updatedResult));
    } catch (err) {
      setRepoError(err.message || "Failed to verify GitHub repository.");
    } finally {
      setIsVerifyingRepo(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedStream(true);
    setTimeout(() => setCopiedStream(false), 2000);
  };

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
  const xray = result.atsXRay || null;
  const mriScore = xray?.mriScore || 85;
  const powScore = powData?.powScore || 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar logoColor="#021F81" buttonColor="#021F81" scrollBgColor="rgba(255,255,255,0.95)" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => router.push("/upload")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Analyze another resume
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-md border border-blue-200">
              Deterministic + AI Hybrid Report
            </span>
          </div>
        </div>

        {/* Master Score Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <ScoreRing score={result.atsScore} label="AI Match" />

              <div className="space-y-1.5 max-w-xl">
                {result.suggestedRole && (
                  <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    Target Role: {result.suggestedRole}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Resume Integrity & ATS Evaluation
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {result.feedback || "Multi-layer evaluation generated across semantic relevance, deterministic parsing, and code verification."}
                </p>

                {/* Score Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{matched.length} Matched Skills</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    <span>{missing.length} Missing Signals</span>
                  </div>
                  {xray && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      <ScanSearch className="h-3.5 w-3.5 text-indigo-600" />
                      <span>MRI: {mriScore}% Machine Readable</span>
                    </div>
                  )}
                  {powData && !powData.error && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                      <span>PoW: {powScore}% Grounded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar on Right */}
            <div className="w-full lg:w-auto flex lg:flex-col sm:flex-row justify-around gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Readability (MRI)</p>
                <p className={`text-xl font-bold ${mriScore >= 80 ? "text-emerald-600" : mriScore >= 60 ? "text-amber-600" : "text-rose-600"}`}>
                  {mriScore}%
                </p>
              </div>
              <div className="border-t lg:border-t-0 sm:border-l lg:border-l-0 border-slate-200 pt-2 lg:pt-0 sm:pl-4 lg:pl-0">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Proof of Work</p>
                <p className={`text-xl font-bold ${powData ? (powScore >= 70 ? "text-emerald-600" : "text-amber-600") : "text-slate-400"}`}>
                  {powData ? `${powScore}%` : "Not Linked"}
                </p>
              </div>
              <div className="border-t lg:border-t-0 sm:border-l lg:border-l-0 border-slate-200 pt-2 lg:pt-0 sm:pl-4 lg:pl-0">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Plan</p>
                <p className="text-xl font-bold text-slate-800 capitalize">
                  {result.plan || "Free"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="h-4 w-4" /> AI Overview & Keywords
          </button>

          <button
            onClick={() => setActiveTab("xray")}
            className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "xray"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ScanSearch className="h-4 w-4" />
            <span>🩻 ATS Parser X-Ray</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Simulator
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pow")}
            className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "pow"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>🛡️ Proof-of-Work Verification</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Code Truth
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Keywords Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" /> Target Keyword Match
                </h2>

                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Identified in Resume ({matched.length})
                </p>
                {matched.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {matched.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-6">No matching keywords detected.</p>
                )}

                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Missing High-Value Keywords ({missing.length})
                </p>
                {missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missing.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600 font-medium">
                    Awesome — no critical missing keywords detected!
                  </p>
                )}
              </div>

              {/* Suggestions Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" /> Strategic Optimizations
                  </h2>

                  {result.suggestions.length > 0 ? (
                    <ol className="space-y-3">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700 leading-snug">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-slate-400">No suggestions returned.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Want to generate an ATS-certified template?</p>
                  <Link
                    href="/template"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Rebuild with Template
                  </Link>
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            {sectionEntries.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-600" /> Section-by-Section Quality Audit
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {sectionEntries.map(([section, text]) => (
                    <div
                      key={section}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/70"
                    >
                      <p className="text-sm font-bold text-slate-800 capitalize mb-1">
                        {section}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATS PARSER X-RAY */}
        {activeTab === "xray" && (
          <div className="space-y-6">
            {/* X-Ray Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                      Multi-Engine Document Inspection
                    </span>
                    <span className="text-xs text-slate-300">Deterministic Parser Emulator</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    ATS Machine Readability Index (MRI): {mriScore}/100
                  </h2>
                  <p className="text-slate-300 text-sm mt-1 max-w-xl">
                    {xray?.verdict || "Evaluated against Taleo, Workday, and Greenhouse document stream ingestion engines."}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="text-center px-2">
                    <p className="text-[11px] text-slate-300 font-semibold uppercase">Pages</p>
                    <p className="text-xl font-bold">{xray?.numPages || 1}</p>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="text-center px-2">
                    <p className="text-[11px] text-slate-300 font-semibold uppercase">Columns</p>
                    <p className="text-xl font-bold">{xray?.isMultiColumn ? "Multi (2+)" : "Single"}</p>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="text-center px-2">
                    <p className="text-[11px] text-slate-300 font-semibold uppercase">Collision Risk</p>
                    <p className={`text-xl font-bold ${xray?.columnJumps > 4 ? "text-rose-400" : "text-emerald-400"}`}>
                      {xray?.columnJumps > 4 ? "High" : "Low"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Deterministic Engine Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-[11px] text-slate-300">Stream Continuity</p>
                  <p className="text-lg font-bold text-indigo-300">{xray?.metrics?.streamContinuity || 90}%</p>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full rounded-full"
                      style={{ width: `${xray?.metrics?.streamContinuity || 90}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-[11px] text-slate-300">Contact Extractability</p>
                  <p className="text-lg font-bold text-emerald-300">{xray?.metrics?.contactIntegrity || 85}%</p>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${xray?.metrics?.contactIntegrity || 85}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-[11px] text-slate-300">Glyph & Font Health</p>
                  <p className="text-lg font-bold text-amber-300">{xray?.metrics?.glyphHealth || 95}%</p>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${xray?.metrics?.glyphHealth || 95}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-[11px] text-slate-300">Standard Headers</p>
                  <p className="text-lg font-bold text-cyan-300">{xray?.metrics?.structureScore || 80}%</p>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${xray?.metrics?.structureScore || 80}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Findings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Deterministic Parsing Findings ({xray?.issues?.length || 0})
              </h3>

              {xray?.issues && xray.issues.length > 0 ? (
                <div className="space-y-4">
                  {xray.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border ${
                        issue.severity === "high"
                          ? "bg-rose-50/70 border-rose-200"
                          : issue.severity === "medium"
                          ? "bg-amber-50/70 border-amber-200"
                          : "bg-emerald-50/70 border-emerald-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {issue.severity === "high" && <XCircle className="h-4 w-4 text-rose-600" />}
                          {issue.severity === "medium" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                          {issue.severity === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          {issue.title}
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white shadow-xs text-slate-700">
                          {issue.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{issue.description}</p>
                      {issue.evidence && (
                        <div className="mt-2 text-xs bg-black/5 p-2 rounded font-mono text-slate-800">
                          <strong>Evidence in stream:</strong> {issue.evidence}
                        </div>
                      )}
                      <p className="text-xs font-semibold text-blue-700 mt-2">
                        💡 Fix: {issue.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800">No Critical Parsing Issues Detected</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Your document structure extracts cleanly in sequential binary stream order.
                  </p>
                </div>
              )}
            </div>

            {/* Split Stream Terminal Visualizer */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    ATS Binary Stream Emulator
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs font-medium">
                    <button
                      onClick={() => setStreamMode("linear")}
                      className={`px-3 py-1 rounded-md transition ${
                        streamMode === "linear"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Machine Raw Stream (Legacy ATS)
                    </button>
                    <button
                      onClick={() => setStreamMode("spatial")}
                      className={`px-3 py-1 rounded-md transition ${
                        streamMode === "spatial"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Spatial 2D (Modern ATS)
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        streamMode === "linear"
                          ? xray?.linearStreamSnippet || ""
                          : xray?.spatialStreamSnippet || ""
                      )
                    }
                    className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition"
                    title="Copy stream"
                  >
                    {copiedStream ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-96 select-text">
                <div className="mb-2 text-indigo-400 text-[11px] pb-2 border-b border-slate-800">
                  {streamMode === "linear"
                    ? "# Ingested character order from raw PDF content stream (Simulating Taleo / Apache PDFBox)"
                    : "# Coordinate-clustered column order (Simulating Greenhouse / pdfminer spatial segmentation)"}
                </div>
                <pre className="whitespace-pre-wrap font-mono">
                  {streamMode === "linear"
                    ? xray?.linearStreamSnippet || "No stream data available."
                    : xray?.spatialStreamSnippet || "No spatial data available."}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROOF-OF-WORK VERIFICATION */}
        {activeTab === "pow" && (
          <div className="space-y-6">
            {/* PoW Top Card */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                      Proof-of-Work Truth Engine
                    </span>
                    <span className="text-xs text-slate-300">Codebase Grounding</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Skill Credibility Score: {powData ? `${powScore}/100` : "Unverified"}
                  </h2>
                  <p className="text-slate-300 text-sm mt-1 max-w-xl">
                    Audits claimed technologies against real GitHub dependency manifests, commit messages, and project language distributions.
                  </p>
                </div>

                {powData && !powData.error && (
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-44">
                    <p className="text-xs text-slate-300 font-semibold uppercase">Verified Repository</p>
                    <a
                      href={powData.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-purple-300 hover:underline flex items-center justify-center gap-1 mt-1"
                    >
                      <GitBranch className="h-4 w-4" />
                      {powData.repoName}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-300">
                      <span>★ {powData.stars || 0}</span>
                      <span>⌥ {powData.forks || 0}</span>
                      <span>{powData.primaryLanguage}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic GitHub Link Input */}
              <form onSubmit={handleVerifyRepo} className="mt-6 pt-6 border-t border-white/10">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Verify or switch GitHub repository:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="url"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      placeholder="https://github.com/username/project-repo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifyingRepo || !repoInput.trim()}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isVerifyingRepo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Auditing Code...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Run PoW Audit
                      </>
                    )}
                  </button>
                </div>
                {repoError && (
                  <p className="text-xs text-rose-300 mt-2 font-medium flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> {repoError}
                  </p>
                )}
              </form>
            </div>

            {/* Verification Results */}
            {powData && !powData.error ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Verified Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Verified Proof-of-Work Skills ({powData.verifiedSkills?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    These technologies were directly confirmed in repository manifests, configs, and code volume.
                  </p>

                  <div className="space-y-3">
                    {powData.verifiedSkills?.map((skill, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {skill.skill}
                            {skill.isClaimedInResume && (
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Claimed in Resume
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            <strong>Evidence:</strong> {skill.evidence}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded shadow-2xs border border-emerald-200">
                          100% Grounded
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unverified / Exaggeration Risks */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Unverified Claims & Exaggeration Audit
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Technologies detected in your resume text or keywords that could not be confirmed in this repository.
                    </p>

                    {powData.unverifiedSkills && powData.unverifiedSkills.length > 0 ? (
                      <div className="space-y-3">
                        {powData.unverifiedSkills.map((item, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-slate-900">{item.skill}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                Discrepancy Alert
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-slate-800">Zero Resume Exaggeration Detected</p>
                        <p className="text-xs text-slate-500 mt-1">
                          All claimed skills in this scope are authenticated by your codebase.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 mt-6">
                    <p className="text-xs font-semibold text-purple-900 flex items-center gap-1.5 mb-1">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Academic & Viva Advantage
                    </p>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      Proof-of-Work Verification solves AI hallucination and resume inflation by anchoring candidate claims against verifiable code artifacts.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto">
                <GitBranch className="h-12 w-12 text-purple-600 mx-auto mb-4 bg-purple-50 p-2.5 rounded-2xl border border-purple-100" />
                <h3 className="text-lg font-bold text-slate-900">No Repository Linked Yet</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Enter the URL of a public GitHub repository where you wrote code for this resume. The system will inspect manifest files, commit histories, and language distributions to verify your technical claims.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}