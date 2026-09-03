"use client";
import { motion } from "framer-motion";
import {
  ListChecks,
  Gauge,
  LayoutTemplate,
  FileDown,
  Cloud,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const features = [
  {
    icon: ListChecks,
    title: "Semantic Keyword Gap Analysis",
    badge: "Gemini AI NLP",
    desc: "Unlike basic string scanners, AchiVAI understands context and synonyms. It discovers missing technical keywords, tools, methodologies, and certifications that recruiters search for in enterprise applicant tracking systems.",
  },
  {
    icon: Gauge,
    title: "Real 0–100 ATS Compatibility Score",
    badge: "Diagnostic Audit",
    desc: "Receive an instantaneous breakdown across 4 critical pillars: Keyword Match Rate, Metric-Driven Impact, Structural Formatting, and Section Completeness — with a clear hiring probability verdict.",
  },
  {
    icon: Search,
    title: "Job-Description Role Tailoring",
    badge: "Targeted Match",
    desc: "Paste any job posting from LinkedIn, Indeed, or company portals. AchiVAI recalibrates your bullet points and technical highlights to match that specific role title, seniority level, and requirements.",
  },
  {
    icon: LayoutTemplate,
    title: "Parser-Certified ATS Templates",
    badge: "Workday & Greenhouse Safe",
    desc: "Canva and design tools often use tables and floating text boxes that break ATS parsers. Our Classic and Modern templates use clean semantic HTML and typography guaranteed to parse cleanly.",
  },
  {
    icon: FileDown,
    title: "One-Click Vector PDF Export",
    badge: "High-Resolution",
    desc: "Export crisp, printer-ready A4 PDFs with standardized fonts and margins. Your text remains selectable, searchable, and intact when uploaded to any job application portal worldwide.",
  },
  {
    icon: Cloud,
    title: "Encrypted & Private Cloud Storage",
    badge: "Bank-Grade Privacy",
    desc: "Sign in with Google or email to store your tailored resumes securely in your private account. Access, duplicate, re-tailor, and download your resumes anytime from any device.",
  },
];

export default function WhyAchiVAISection() {
  return (
    <section className="josefin-sans w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Why AchiVAI Outperforms Generic Builders
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            Engineered Specifically to Beat Automated Screening Bots
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-4 text-base sm:text-lg leading-relaxed"
          >
            Most resume tools prioritize flashy graphics that confuse parsers. AchiVAI reads your resume through the exact algorithms used by recruiters, ensuring you get ranked at the top of candidate pools.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#F6F8FF] border border-[#021F81]/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#021F81]/30 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#021F81] text-white shadow-sm">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-bold text-[#021F81] bg-white border border-[#021F81]/15 px-2.5 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Box: AchiVAI vs Generic Builders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Generic Builders vs. AchiVAI ATS Intelligence
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Why flashy design templates fail screening algorithms and how AchiVAI ensures your resume passes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Generic */}
            <div className="bg-slate-800/60 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-4 text-base">
                <XCircle className="h-5 w-5" />
                <span>Standard Builders (Canva, Word, Generic Templates)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  Complex tables and multi-column floating boxes break ATS text extraction
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  No real-time job description keyword match or gap analysis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  Vague, subjective writing with no automated achievement quantification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  Overpriced recurring subscriptions that bill every month
                </li>
              </ul>
            </div>

            {/* AchiVAI */}
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 text-base">
                <CheckCircle2 className="h-5 w-5" />
                <span>AchiVAI ATS-Optimized Platform</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  100% parser-tested layouts certified for Greenhouse, Workday, Lever, and Taleo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  Semantic AI match compares skills directly against target job postings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  Instant bullet rewrites with strong action verbs and measurable business outcomes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  Free tier available; optional one-time upgrade with no sneaky monthly auto-renewals
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}