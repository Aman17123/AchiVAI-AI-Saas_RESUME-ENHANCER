"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import "../globals.css";

export default function UploadSection() {
  return (
    <section className="relative josefin-sans sm:mt-0 -mt-27  w-full min-h-[60vh] flex  flex-col justify-center items-center  text-[#0a0a0a] px-6 py-20 overflow-hidden">
      
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-2xl josefin-sans sm:text-3xl md:text-5xl font-semibold text-center mb-6 tracking-tight"
      >
        Simply upload your resume and <br className="hidden sm:block" />
        download in just one click!
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl text-gray-700 text-m sm:text-xl leading-relaxed mb-10 mt-6 sm:mt-10"
      >
        This is where the magic happens: our AI instantly analyzes your document,
        fixing common errors, optimizing keywords for ATS systems.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex gap-5"
      >
        <a
          href="/upload"
          className="px-6 py-2 rounded-lg border-2 border-black font-medium text-base text-black 
                    bg-transparent transition-all duration-300 ease-out cursor-pointer
                    hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:translate-y-0"
        >
          Upload Resume
        </a>

        {/* Dark Button */}
        <Link
          href="/template"
          className="px-6 py-2 rounded-lg border-2 border-black font-medium text-base text-white 
                    bg-black transition-all duration-300 ease-out cursor-pointer
                    hover:bg-gray-800 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] active:translate-y-0"
        >
          Select Template
        </Link>
      </motion.div>

      {/* Bottom subtle reappearing text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl josefin-sans text-gray-600 text-sm mt-12"
      >
        This is where the magic happens: our AI instantly analyzes your document,
        fixing common errors, optimizing keywords for ATS systems.
      </motion.p>
    </section>
  );
}
