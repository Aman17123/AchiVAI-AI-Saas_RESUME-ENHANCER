"use client";
import { motion } from "framer-motion";
import {
  ListChecks,
  Gauge,
  LayoutTemplate,
  FileDown,
  Cloud,
  Search,
} from "lucide-react";

const features = [
  {
    icon: ListChecks,
    title: "Keyword matching that works",
    desc: "AchiVAI lists the exact keywords present in your resume and the ones you are missing — before the ATS quietly filters you out.",
  },
  {
    icon: Gauge,
    title: "Real ATS readiness score",
    desc: "A 0–100 score with a clear verdict (Excellent / Needs Work / Weak) so you always know where your resume stands.",
  },
  {
    icon: Search,
    title: "Job-description tailoring",
    desc: "Paste the job ad and AchiVAI optimizes your resume around that exact role, role title included.",
  },
  {
    icon: LayoutTemplate,
    title: "ATS-friendly templates",
    desc: "Classic and Modern — designed for parsers, not just pretty previews.",
  },
  {
    icon: FileDown,
    title: "One-click PDF export",
    desc: "Every template exports to a clean, print-ready, applicant-friendly PDF that keeps its layout.",
  },
  {
    icon: Cloud,
    title: "Private cloud saves",
    desc: "Sign in with Google or email and your resumes are stored securely in your own account, accessible anywhere.",
  },
];

export default function WhyAchiVAISection() {
  return (
    <section className="josefin-sans w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Why AchiVAI
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            The AI resume builder built to clear the ATS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-4 text-base sm:text-lg"
          >
            AchiVAI reads your resume the way an Applicant Tracking System does,
            then shows you exactly what human recruiters and machines want to
            see.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#F6F8FF] border border-[#021F81]/10 rounded-2xl p-6"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#021F81] text-white mb-4">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}