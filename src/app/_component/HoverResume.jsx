"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import "../globals.css";

export default function HoverResume() {
  const cvImages = [
    "https://i.pinimg.com/736x/e6/8d/b3/e68db3e71629d4a89e22ff3490b843d2.jpg",
    "https://i.pinimg.com/736x/09/2a/62/092a62b0ccee9978b1da750eb4a9dcbf.jpg",
    "https://i.pinimg.com/736x/e6/8d/b3/e68db3e71629d4a89e22ff3490b843d2.jpg",
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-24 bg-[#F8FAFF]">
      {/* Top SVG Line */}
      <div className="absolute top-6 left-0 w-full flex justify-start opacity-70 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="539"
          height="52"
          viewBox="0 0 539 52"
          fill="none"
        >
          <path
            d="M-6.99434 44.5989C-6.99434 44.5989 29.0445 -6.38692 53.4263 7.35251C69.4454 16.3795 49.0691 40.5334 67.4061 46.0054C87.2642 51.9312 87.6467 18.3735 108.811 17.9222C128.126 17.5104 131.275 36.7602 150.256 39.6932C177.599 43.9185 188.573 20.7984 216.184 17.9907C256.541 13.8868 276.156 38.4595 316.81 39.7993C356.352 41.1025 377.565 20.1477 416.563 25.593C436.634 28.3956 445.47 37.4413 465.611 39.8942C492.059 43.1151 508.759 41.625 533.665 33.8219"
            stroke="#6F90B7"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Section */}
      <div className="text-center josefin-sans max-w-4xl mt-12 px-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Recruiter-Approved Resume Architecture</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Build a Resume That Recruiter Algorithms Love
        </h2>
        
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          AchiVAI structures your credentials into clean visual hierarchies, balancing machine-readable ATS compliance with eye-catching clarity that captivates hiring managers in the first 6 seconds.
        </p>

        {/* Cards with Dividers */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
          {/* Left Card */}
          <div className="group rounded-2xl shadow-md overflow-hidden w-[280px] sm:w-[320px] h-[370px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl bg-white border border-gray-200">
            <Image
              src={cvImages[0]}
              alt="Single Column ATS Resume Example"
              width={320}
              height={370}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[3px] h-[280px] bg-slate-300 rounded-full"></div>

          {/* Middle Card */}
          <div className="group bg-white rounded-2xl shadow-xl overflow-hidden w-[300px] sm:w-[360px] h-[430px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl border-2 border-[#021F81]/20">
            <Image
              src={cvImages[1]}
              alt="High-Impact Professional Resume Layout"
              width={360}
              height={430}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[3px] h-[280px] bg-slate-300 rounded-full"></div>

          {/* Right Card */}
          <div className="group bg-white rounded-2xl shadow-md overflow-hidden w-[280px] sm:w-[320px] h-[370px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl border border-gray-200">
            <Image
              src={cvImages[2]}
              alt="Modern Clean Tech Resume Format"
              width={320}
              height={370}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* CTA Button below gallery */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/template"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#021F81] text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-[#031a66] transition-all shadow-md hover:shadow-lg"
          >
            <span>Explore All ATS Templates</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
