"use client";

import { motion } from "framer-motion";
import Navbar from "../_component/Navbar";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, Plus, ArrowRight, CheckCircle2 } from "lucide-react";

const templates = [
  {
    id: "classic",
    title: "Classic ATS",
    subtitle: "Single-column traditional layout engineered to pass all enterprise ATS scanners.",
    badge: "Most Popular",
    img: "/template-previews/classic.png",
    features: ["100% ATS-Compliant", "Academic & Corporate", "Single Column Format"],
  },
  {
    id: "modern",
    title: "Modern Professional",
    subtitle: "High-impact two-column layout with dark sidebar, designed for tech & creative roles.",
    badge: "Recommended",
    img: "/template-previews/modern.png",
    features: ["Visual Hierarchy", "Sidebar Skills & Contact", "Ideal for Tech & Design"],
  },
];

function HeroSection({ onSelectClick }) {
  return (
    <section className="relative flex flex-col josefin-sans -mt-15 items-center justify-center min-h-screen text-white px-6 text-center overflow-hidden">
      <Navbar logoColor="#ffffff" buttonColor="#0000ff" scrollBgColor="#000000" />

      {/* TOP SOFT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-white/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-medium mb-4 mt-20"
      >
        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
        <span>Professional ATS-Approved Resume Templates</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-semibold leading-snug"
      >
        Stop Applying. Start <span className="underline decoration-blue-500">Getting</span> Hired.
      </motion.h1>

      <p className="mt-4 max-w-xl text-sm md:text-base text-gray-300">
        Choose a proven, ATS-friendly resume template. Customize every section with real-time preview and export a crisp PDF in seconds.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          onClick={onSelectClick}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="px-6 py-3 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
        >
          <span>Browse Templates</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          onClick={() => (window.location.href = "/template/new")}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="px-6 py-3 cursor-pointer rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white font-medium border border-white/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Start Blank Resume</span>
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-blue-600/10 blur-[140px]" />
    </section>
  );
}

/* RESUME CARD COMPONENT */
function ResumeCard({ tpl, index }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative flex flex-col bg-slate-900/80 border border-white/15 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-sm w-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white tracking-tight">{tpl.title}</h3>
        {tpl.badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            {tpl.badge}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-4 h-9 line-clamp-2">
        {tpl.subtitle}
      </p>

      {/* Preview Image Frame */}
      <div
        onClick={() => router.push(`/template/${tpl.id}`)}
        className="relative w-full aspect-[3/4] bg-white rounded-xl shadow-inner overflow-hidden cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
      >
        <Image
          src={tpl.img}
          alt={`${tpl.title} preview`}
          width={320}
          height={420}
          className="object-cover w-full h-full"
        />

        {/* Hover overlay with action button */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/template/${tpl.id}`);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105"
          >
            <span>Use Template</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-4 space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-300">
        {tpl.features.map((feat, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <button
        onClick={() => router.push(`/template/${tpl.id}`)}
        className="mt-5 w-full py-2.5 px-4 bg-white/10 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Customize {tpl.title}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/* BLANK RESUME CARD */
function BlankCard() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onClick={() => router.push("/template/new")}
      className="group flex flex-col items-center justify-center bg-slate-900/40 border-2 border-dashed border-white/20 hover:border-blue-400/60 rounded-2xl p-8 shadow-xl backdrop-blur-sm max-w-sm w-full min-h-[460px] cursor-pointer transition-all duration-300 hover:bg-slate-900/70 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 mb-5">
        <Plus className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Start from Scratch</h3>
      <p className="text-xs text-slate-400 max-w-xs mb-6">
        Prefer full control? Begin with a clean, unpopulated resume and fill in your details step-by-step.
      </p>

      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
        <span>Create Blank Resume</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.div>
  );
}

/* RESUME GALLERY SECTION */
function ResumeGallery() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-12 py-20 relative overflow-hidden text-white">
      {/* Decorative SVGs */}
      <svg className="absolute top-0 right-10 opacity-40 pointer-events-none" width="180" height="220" viewBox="0 0 253 250" fill="none">
        <rect x="0.5" y="-56.5" width="252" height="306" stroke="white" opacity="0.4" />
        <rect x="138" y="-91" width="115" height="125" fill="#D9D9D9" fillOpacity="0.08" />
      </svg>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
          Select Your Resume Template
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Every template is engineered to meet recruiter standards, ATS requirements, and modern visual polish.
        </p>
      </div>

      <div className="flex flex-wrap items-stretch justify-center gap-8 max-w-6xl mx-auto w-full">
        {templates.map((tpl, i) => (
          <ResumeCard key={tpl.id} tpl={tpl} index={i} />
        ))}
        <BlankCard />
      </div>

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[200px] bg-blue-600/10 blur-[100px]" />
    </section>
  );
}

/* PAGE WRAPPER */
export default function TemplatePage() {
  const galleryRef = useRef(null);

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* GLOBAL RADIAL BG */}
      <div
        className="
          absolute top-0 left-1/2 -translate-x-1/2 
          w-[900px] h-[900px]
          bg-gradient-radial from-white/10 to-transparent
          blur-[160px] opacity-60 pointer-events-none
        "
      />

      <HeroSection
        onSelectClick={() => {
          galleryRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div ref={galleryRef}>
        <ResumeGallery />
      </div>
    </div>
  );
}
