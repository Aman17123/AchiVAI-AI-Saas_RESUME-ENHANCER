"use client";
import { motion } from "framer-motion";
import { Upload, SearchCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload your resume",
    desc: "Drop a PDF or DOCX. AchiVAI immediately reads your structure, wording, and formatting — no setup required.",
  },
  {
    icon: SearchCheck,
    title: "Get an AI ATS score",
    desc: "Our AI compares your resume against the job description and the keywords recruiters actually use, scoring you out of 100 with exact missing keywords.",
  },
  {
    icon: Rocket,
    title: "Fix, rebuild, get hired",
    desc: "Apply the suggested keywords, rebuild in an ATS-friendly AchiVAI template, and export a clean PDF in one click.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="josefin-sans w-full py-24 px-6 bg-[#F6F8FF]">
      <div className="max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3"
        >
          How it works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
        >
          Beat the ATS in three steps
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl border border-[#021F81]/10 shadow-sm p-8 text-left"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#021F81] text-white">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="text-white bg-[#021F81] rounded-full px-2 py-0.5 text-xs font-bold">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}