"use client";
import { motion } from "framer-motion";
import { Upload, SearchCheck, Sparkles, FileDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Upload,
    title: "1. Upload & Instant Parse",
    badge: "PDF / DOCX",
    desc: "Drop your existing resume in PDF or Word format. AchiVAI's semantic document parser instantly extracts your contact data, work history, skill taxonomy, and education without breaking formatting.",
    detail: "Supports all standard resume formats with zero manual setup required.",
  },
  {
    icon: SearchCheck,
    title: "2. Real-Time ATS Audit & Scoring",
    badge: "0–100 Score",
    desc: "Optionally paste any job description. Our AI performs an in-depth keyword gap analysis, cross-checking your resume against the exact skills and qualifications enterprise ATS algorithms filter by.",
    detail: "Identifies hard skills, soft skills, missing acronyms, and industry keywords.",
  },
  {
    icon: Sparkles,
    title: "3. AI Bullet & Keyword Enhancement",
    badge: "Actionable Insights",
    desc: "Review targeted, section-by-section suggestions. Replace passive language with high-impact action verbs and quantified metrics that impress both automated screening bots and hiring managers.",
    detail: "Transforms generic duties into quantifiable, high-converting achievement statements.",
  },
  {
    icon: FileDown,
    title: "4. One-Click ATS-Verified PDF Export",
    badge: "Parser-Certified",
    desc: "Rebuild or edit inside our live resume studio. Switch seamlessly between Classic single-column and Modern two-column templates, then export a crisp, recruiter-ready PDF in one click.",
    detail: "Guaranteed parser-safe text rendering across Greenhouse, Lever, Workday, and Taleo.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="josefin-sans w-full py-24 px-6 bg-[#F6F8FF] border-y border-[#021F81]/10">
      <div className="max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3"
        >
          ATS Optimization Workflow
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
        >
          How AchiVAI Beats the Applicant Tracking System
        </motion.h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Over 75% of resumes are discarded by automated ATS filters before a human recruiter ever sees them. Here is our 4-step formula to ensure yours passes every time.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 text-left">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl border border-[#021F81]/10 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-[#021F81]/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#021F81] text-white shadow-sm group-hover:scale-105 transition-transform">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-bold text-[#021F81] bg-[#021F81]/10 px-2.5 py-1 rounded-full">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                {step.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 inline-flex flex-col sm:flex-row items-center gap-4 bg-white border border-[#021F81]/15 rounded-2xl px-6 py-4 shadow-sm">
          <span className="text-sm text-gray-700 font-medium">
            Ready to check your resume score against real job descriptions?
          </span>
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#021F81] hover:text-[#031a66] transition-colors"
          >
            <span>Scan Your Resume Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}