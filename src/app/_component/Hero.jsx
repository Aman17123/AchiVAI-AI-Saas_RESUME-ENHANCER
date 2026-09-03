"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Zap, ArrowRight, FileCheck } from "lucide-react";
import "../globals.css";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] mt-25 md:mt-30 flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8">
      
      {/* ===== HERO TEXT ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
      >
        {/* Top SEO Keyword Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#021F81]/10 text-[#021F81] text-xs sm:text-sm font-semibold mb-6 border border-[#021F81]/15 shadow-sm">
          <Sparkles className="h-4 w-4 text-[#021F81]" />
          <span>Next-Gen AI Resume Builder & ATS Score Checker</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold josefin-sans text-gray-900 leading-tight tracking-tight">
          Stop Applying. Start{" "}
          <span className="text-[#021F81] underline decoration-[#021F81]/30">
            Getting Hired.
          </span>
        </h1>

        <p className="text-gray-600 mt-5 josefin-sans text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Our intelligent AI scans, audits, and custom-tailors your resume to bypass Applicant Tracking Systems (ATS), match key job description requirements, and double your interview callbacks.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs sm:text-sm text-gray-600 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            98% ATS Pass Rate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            Instant Keyword Matching
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-[#021F81]" />
            Clean One-Click PDF Export
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/upload"
            className="w-full sm:w-auto bg-[#021F81] text-white text-sm josefin-sans sm:text-base px-7 py-3.5 rounded-xl hover:bg-[#031a66] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <span>Scan Your Resume Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/template"
            className="w-full sm:w-auto bg-white text-[#021F81] border border-[#021F81]/30 text-sm josefin-sans sm:text-base px-7 py-3.5 rounded-xl hover:bg-[#021F81]/5 transition-all shadow-sm flex items-center justify-center gap-2 font-medium"
          >
            <span>Choose ATS Template</span>
          </Link>
        </div>

        {/* Social Proof Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex text-amber-400 text-sm">★★★★★</div>
          <span className="font-semibold text-gray-800">4.9/5</span>
          <span>from 5,000+ candidates hired at top tech & Fortune 500 companies</span>
        </div>
      </motion.div>

      {/* ===== RESUME CARD GROUP ===== */}
      <div className="relative flex justify-center items-end mt-12 w-full max-w-5xl mx-auto pb-32">
        
        {/* ===== CENTER CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 120, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{
            scale: 1.08,
            y: -10,
            rotate: 0,
            boxShadow: "0 25px 55px rgba(0,0,0,0.18)",
            transition: { duration: 0.25, ease: "easeOut" },
          }}
          className="relative z-[20] w-[60%] sm:w-[45%] md:w-[30%] rounded-2xl shadow-2xl overflow-hidden bg-white rotate-[4deg]"
        >
          <div className="relative pb-[141.4%]">
            <Image
              src="https://i.pinimg.com/1200x/48/7c/13/487c13a9ed77a264ff9193f61c9261de.jpg"
              alt="AchiVAI ATS Optimized Resume Sample"
              fill
              quality={75}
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* ===== LEFT CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 120, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{
            scale: 1.05,
            y: -8,
            rotate: -8,
            boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
            transition: { duration: 0.25, ease: "easeOut" },
          }}
          className="absolute left-1/2 z-30 sm:top-auto -translate-x-[145%] -translate-y-2 w-[30%] sm:w-[25%] md:w-[20%] rounded-xl shadow-xl rotate-[-12deg] overflow-hidden bg-white"
        >
          <div className="relative pb-[141.4%]">
            <Image
              src="https://i.pinimg.com/736x/f7/7c/c9/f77cc9be9b7ee9316c0e707a38590c00.jpg"
              alt="Classic ATS Single-Column Resume Template"
              fill
              quality={75}
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* ===== RIGHT CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 120, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{
            scale: 1.05,
            y: -8,
            rotate: 8,
            boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
            transition: { duration: 0.25, ease: "easeOut" },
          }}
          className="absolute z-30 left-1/2 sm:top-auto translate-x-[55%] -translate-y-30 w-[30%] sm:w-[25%] md:w-[20%] rounded-xl shadow-xl rotate-[12deg] overflow-hidden bg-white border-[0.3px] border-white/80"
        >
          <div className="relative pb-[141.4%]">
            <Image
              src="https://i.pinimg.com/736x/e6/8d/b3/e68db3e71629d4a89e22ff3490b843d2.jpg"
              alt="Modern Professional AI Resume Template"
              fill
              quality={75}
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
              className="object-cover"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
