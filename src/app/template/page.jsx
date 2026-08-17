"use client";

import { motion } from "framer-motion";
import Navbar from "../_component/Navbar";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../app/globals.css";
import { useRouter } from "next/navigation";

const cards = [
  { id: "classic", img: "/template-previews/classic.png" },
  { id: "modern", img: "/template-previews/modern.png" },
];


  function HeroSection({ onSelectClick }) {
    return (
      <section className="relative flex flex-col josefin-sans -mt-15  items-center justify-center min-h-screen text-white px-6 text-center overflow-hidden">

        <Navbar logoColor="#ffffff" buttonColor="#0000ff" scrollBgColor="#000000"/>
        
        {/* TOP SOFT GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-white/10 blur-[120px]" />

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-semibold leading-snug mt-24"
        >
          Stop Applying. Start <span className="underline">Getting</span> Hired.
        </motion.h1>

        <p className="mt-4 max-w-xl text-sm md:text-base text-gray-300">
          Our AI instantly scans, optimizes, and tailors your resume to beat the ATS and match the job description every time.
        </p>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          onClick={onSelectClick} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="mt-6 px-6 py-3 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
        >
          Select Template
        </motion.button>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-white/10 blur-[120px]" />
      </section>
    );
  }

/* RESUME CARD COMPONENT */
  function ResumeCard({ img, index ,id }) {
    const router = useRouter();
    const isEven = index % 2 === 0;

    return (
      <motion.div
        onClick={() => router.push(`/template/${id}`)}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
        className={`relative w-fit overflow-visible 
          ${isEven ? "sm:-mt-10 mt-4" : "sm:mt-10 mt-10"}
        `}
      >
        {/* Card */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-64 aspect-[3/4] bg-white rounded-b-xl shadow-2xl relative overflow-hidden z-10"
        >     
            <Image 
              src={img}
              alt={`${id.charAt(0).toUpperCase() + id.slice(1)} resume template preview — AchiVAI ATS-friendly`}
              width={300}
              height={400}
              className="object-cover rounded-b-xl"
            />
          {/* Soft Black Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-b-xl pointer-events-none" />
        </motion.div>

        {/* Background overlay */}
        <div
          className={`
            absolute ${isEven ? "top-45 sm:top-35" : "top-45"}
            left-1/2 -translate-x-1/2
            w-[110%] h-[53%] rounded-b-xl bg-[#D9D9D9] opacity-50 z-0 pointer-events-none
          `}
        />
      </motion.div>
    );
  }

/* RESUME GALLERY SECTION */
  function ResumeGallery() {
    return (
      <section className="w-full min-h-screen flex items-center justify-center px-4 md:px-16 py-20 relative overflow-hidden text-white">

        {/* Decorative SVGs */}
        <svg className="absolute top-0 right-10 opacity-80" width="180" height="220" viewBox="0 0 253 250" fill="none">
          <rect x="0.5" y="-56.5" width="252" height="306" stroke="white" opacity="0.4" />
          <rect x="138" y="-91" width="115" height="125" fill="#D9D9D9" fillOpacity="0.08" />
        </svg>

        <svg className="absolute bottom-0 left-10 opacity-80" width="200" height="200" viewBox="0 0 216 107" fill="none">
          <rect x="0.5" y="0.5" width="198" height="210" stroke="white" opacity="0.4" />
          <rect x="17" y="35" width="198" height="210" stroke="white" opacity="0.4" />
        </svg>

        <svg className="absolute top-60 left-0" width="118" height="178" fill="none">
          <rect x="-38" width="156" height="178" fill="#D9D9D9" fillOpacity="0.1" />
        </svg>

        <svg className="absolute top-90 left-100" width="156" height="178" fill="none">
          <rect width="156" height="178" fill="#D9D9D9" fillOpacity="0.1" />
        </svg>

        <div className="flex cursor-pointer flex-wrap justify-center gap-10 max-w-[1400px] mx-auto">
          {cards.map((card, i) => (
            <ResumeCard key={i} id={card.id} img={card.img} index={i} />
          ))}
        </div>

        {/* BOTTOM GLOW */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[200px] bg-white/5 blur-[90px]" />
      </section>
    );
  }

/* PAGE WRAPPER (GLOBAL GRADIENT) */
  export default function TemplatePage() {
    const galleryRef = useRef(null);
    return (
      <div className="relative bg-black overflow-hidden">

        {/* GLOBAL RADIAL BG FOR BOTH SECTIONS */}
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2 
            w-[900px] h-[900px]
            bg-gradient-radial from-white/10 to-transparent
            blur-[160px] opacity-60 pointer-events-none
          "
        />

        <HeroSection onSelectClick={() => {
          galleryRef.current?.scrollIntoView({ behavior: "smooth" });
        }} />

        <div ref={galleryRef}>
          <ResumeGallery />
        </div>
      </div>
    );
  }
