"use client";
import Image from "next/image";
import "../globals.css";

export default function HoverResume() {
  const cvImages = [
    "https://i.pinimg.com/736x/e6/8d/b3/e68db3e71629d4a89e22ff3490b843d2.jpg",
    "https://i.pinimg.com/736x/09/2a/62/092a62b0ccee9978b1da750eb4a9dcbf.jpg",
    "https://i.pinimg.com/736x/e6/8d/b3/e68db3e71629d4a89e22ff3490b843d2.jpg",
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Top SVG Line */}
      <div className="absolute top-6 left-0 w-full flex justify-start">
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
      <div className="text-center josefin-sans max-w-4xl mt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Build a Resume That Gets You Hired
        </h1>
        <p className="text-gray-700 mb-12 leading-relaxed">
          This is where the magic happens: our AI instantly analyzes your
          document, fixing common errors, optimizing keywords for ATS systems,
        </p>

        {/* Cards with Dividers */}
        <div className="flex justify-center items-center gap-8">
          {/* Left Card */}
          <div className="group rounded-2xl shadow-md overflow-hidden w-[340px] h-[370px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl aspect=[3/4]">
            <Image
              src={cvImages[0]}
              alt="Left CV"
              width={300}
              height={370}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          {/* Divider */}
          <div className="w-[4px] h-[280px] bg-black rounded-full"></div>

          {/* Middle Card */}
          <div className="group bg-white rounded-2xl shadow-md overflow-hidden w-[420px] h-[450px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl">
            <Image
              src={cvImages[1]}
              alt="Middle CV"
              width={380}
              height={450}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          {/* Divider */}
          <div className="w-[4px] h-[280px] bg-black rounded-full"></div>

          {/* Right Card */}
          <div className="group bg-white rounded-2xl shadow-md overflow-hidden w-[340px] h-[370px] transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl aspect=[3/4]">
            <Image
              src={cvImages[2]}
              alt="Right CV"
              width={300}
              height={370}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
