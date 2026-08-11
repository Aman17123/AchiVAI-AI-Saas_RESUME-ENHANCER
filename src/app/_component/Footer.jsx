"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#02285C] text-white py-8 px-9 sm:px-10 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-center md:text-left">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center md:items-start"
        >
          <h2 className="text-white text-[22px] sm:text-[24px] kosugi-maru-regular font-semibold tracking-wider mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white text-[#02285C] text-sm font-bold">
              A
            </span>
            AchiVAI
          </h2>
          <p className="text-[#BFD3F2] josefin-sans text-[14px] sm:text-[15px] leading-relaxed max-w-xs sm:max-w-sm">
            AI-powered resume builder that helps you beat the ATS and get hired.
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:text-right flex flex-col items-center md:items-end gap-2"
        >
          <p className="text-[#BFD3F2] josefin-sans text-[13px] sm:text-[14px]">
            © {year} AchiVAI. All Rights Reserved
          </p>
          <p className="text-[#BFD3F2] josefin-sans text-[12px] sm:text-[13px] opacity-90">
            Made by{" "}
            <a
              href="https://github.com/Aman17123"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Aman Nakoti
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}