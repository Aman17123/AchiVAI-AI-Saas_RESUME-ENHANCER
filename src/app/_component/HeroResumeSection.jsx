"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import "../globals.css";

export default function HeroResumeSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="399"
        height="560"
        viewBox="0 0 599 560"
        fill="none"
        className="-mt-50 pointer-events-none opacity-40"
      >
        <path d="M-20.5332 542.245C-20.5332 542.245 -46.1332 476.07 4.02843 413.529C99.9907 293.884 309.141 361.089 431.146 240.004C503.073 168.62 509.294 75.4285 509.294 75.4285" stroke="black"/>
        <path d="M-42.0879 528.464C-42.0879 528.464 -67.6879 462.289 -17.5263 399.748C78.4361 280.103 287.586 347.307 409.592 226.222C481.518 154.838 487.739 61.6473 487.739 61.6473" stroke="black"/>
        <path d="M-63.6387 514.706C-63.6387 514.706 -89.2387 448.531 -39.077 385.99C56.8853 266.345 266.036 333.55 388.041 212.465C459.967 141.081 466.188 47.8895 466.188 47.8895" stroke="black"/>
        <path d="M-85.1953 500.925C-85.1953 500.925 -110.795 434.75 -60.6337 372.209C35.3286 252.564 244.479 319.768 366.484 198.683C438.411 127.299 444.632 34.1082 444.632 34.1082" stroke="black"/>
        <path d="M-106.746 487.159C-106.746 487.159 -132.346 420.984 -82.1845 358.443C13.7778 238.798 222.928 306.003 344.934 184.918C416.86 113.534 423.081 20.3426 423.081 20.3426" stroke="black"/>
      </svg>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-7xl -mt-80 josefin-sans mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-20">
        {/* === Left Text Side === */}
        <div className="flex flex-col max-w-xl space-y-6 text-left mt-10 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#ff7b00] text-xs font-bold w-fit"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Proven Enterprise ATS Results</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl sm:text-left text-center font-semibold leading-tight text-gray-900 josefin-sans"
          >
            Optimize your resume and multiply your{" "}
            <span className="text-[#ff7b00] font-bold">interview calls.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600 sm:text-left text-center leading-relaxed josefin-sans text-base sm:text-lg"
          >
            Over 98% of Fortune 500 employers utilize Applicant Tracking Systems (ATS) like Greenhouse, Workday, Lever, and Taleo. AchiVAI ensures your resume matches recruiter criteria and passes automated screening filters every single time.
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">4.2x</p>
              <p className="text-xs text-gray-500 mt-0.5">More Interviews</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">98%</p>
              <p className="text-xs text-gray-500 mt-0.5">ATS Pass Rate</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">&lt; 15s</p>
              <p className="text-xs text-gray-500 mt-0.5">AI Scan Speed</p>
            </div>
          </div>

          {/* === Company Logos === */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center sm:text-left">
              Candidates hired across leading global teams
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4 sm:gap-6"
            >
              <Image
                src="/images/logos/google.svg"
                alt="Google"
                width={80}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition-all opacity-80"
              />
              <Image
                src="/images/logos/amazon.svg"
                alt="Amazon"
                width={80}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition-all opacity-80"
              />
              <Image
                src="/images/logos/nvidia.svg"
                alt="Nvidia"
                width={80}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition-all opacity-80"
              />
              <Image
                src="/images/logos/tiktok.svg"
                alt="TikTok"
                width={80}
                height={50}
                className="object-contain grayscale hover:grayscale-0 transition-all opacity-80"
              />
            </motion.div>
          </div>

          {/* === Buttons === */}
          <div className="flex sm:justify-start justify-center gap-4 pt-2">
            <Link
              href="/upload"
              className="w-fit bg-black text-white text-sm sm:text-base px-6 py-3 rounded-xl shadow-md hover:bg-[#ff7b00] transition-all cursor-pointer font-medium"
            >
              Upload Resume
            </Link>

            <Link
              href="/template"
              className="w-fit bg-white text-black border border-gray-300 text-sm sm:text-base px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all cursor-pointer font-medium"
            >
              Select Template
            </Link>
          </div>

          {/* === Bottom Caption === */}
          <p className="text-xs text-gray-500 text-center sm:text-left flex items-center gap-1.5 justify-center sm:justify-start">
            <CheckCircle2 className="h-4 w-4 text-green-600 inline" />
            <span>Compatible with Workday, Greenhouse, Lever, Taleo, iCIMS, and SAP SuccessFactors.</span>
          </p>
        </div>

        {/* === Right Resume Preview === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative w-full md:w-1/2 flex justify-center mb-10 md:mb-0"
        >
          {/* ===== Main Resume ===== */}
          <div className="relative w-[75vw] sm:w-[360px] md:w-[420px] aspect-[3/4] rounded-[24px] shadow-2xl overflow-hidden border-[4px] border-white bg-white z-10">
            <Image
              src="https://i.pinimg.com/736x/77/de/37/77de37a4f5877b9b176aff2b6ba650f0.jpg"
              alt="High Scoring ATS Resume Example"
              fill
              quality={75}
              className="object-cover"
            />
          </div>

          {/* ===== Outline Lines (Hidden on Mobile) ===== */}
          <div className="hidden sm:block absolute w-[380px] h-[480px] border-2 border-[#a0b4cc] rounded-[24px] top-[20px] left-0 pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}
