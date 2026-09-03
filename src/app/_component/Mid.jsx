"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, FileText, Download } from "lucide-react";
import "../globals.css";

export default function UploadSection() {
  return (
    <section className="relative josefin-sans sm:mt-0 -mt-20 w-full min-h-[55vh] flex flex-col justify-center items-center text-[#0a0a0a] px-6 py-20 overflow-hidden bg-gradient-to-b from-white via-[#F6F8FF] to-white">
      
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Instant AI Optimization</span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-5xl font-semibold text-center mb-5 tracking-tight max-w-3xl"
      >
        Transform Your Existing Resume into an <br className="hidden sm:block" />
        <span className="text-[#021F81] underline decoration-[#021F81]/30">ATS-Optimized</span> Masterpiece
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl text-gray-700 text-base sm:text-lg leading-relaxed mb-8"
      >
        Upload in PDF or DOCX format. In under 15 seconds, our AI identifies critical keyword gaps, eliminates unreadable layout elements, and structures your resume for peak recruiter visibility.
      </motion.p>

      {/* Key Feature Checks */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-10 text-xs sm:text-sm text-gray-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" />
          Semantic Keyword Matching
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" />
          Zero Unwanted Text Formatting
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" />
          Print & Parser Ready Vector PDF
        </span>
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Link
          href="/upload"
          className="px-7 py-3 rounded-xl border-2 border-[#021F81] font-semibold text-sm sm:text-base text-white 
                    bg-[#021F81] transition-all duration-300 ease-out cursor-pointer
                    hover:bg-[#031a66] hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Upload & Audit Resume</span>
        </Link>

        <Link
          href="/template"
          className="px-7 py-3 rounded-xl border-2 border-slate-900 font-semibold text-sm sm:text-base text-slate-900 
                    bg-white transition-all duration-300 ease-out cursor-pointer
                    hover:bg-slate-900 hover:text-white hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Build from ATS Template</span>
        </Link>
      </motion.div>

      {/* Bottom context banner */}
      <p className="text-center max-w-xl text-gray-500 text-xs mt-10">
        Engineered for candidates applying to top roles in Engineering, Product, Data, Marketing, Finance, and Operations worldwide.
      </p>
    </section>
  );
}
