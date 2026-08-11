"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import cursor from "../../../public/images/cursor.png";
import "../globals.css";

export default function ResumeHighlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40 });
  const [isInside, setIsInside] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const resumeImages = [
    "https://i.pinimg.com/1200x/48/7c/13/487c13a9ed77a264ff9193f61c9261de.jpg",
    "https://i.pinimg.com/736x/25/74/81/257481fa127c031b5bfae629149f895b.jpg",
    "https://i.pinimg.com/736x/61/75/77/617577ef7a169f32b22ae9579e6c5cef.jpg",
    "https://i.pinimg.com/736x/af/10/e4/af10e42f44b5fa84bcc12e0511316163.jpg",
    "https://i.pinimg.com/736x/5f/a5/5c/5fa55c4ebc9ad09e34858631c9684f7f.jpg",
  ];

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const triggerFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    // "jumpy" faster flip — image changes mid-way
    setTimeout(() => {
      setImgIndex((prev) => (prev + 1) % resumeImages.length);
    }, 250);

    setTimeout(() => setIsFlipped(false), 600);
  };

  // Shared hover handlers for all trigger points
  const handlePointHoverStart = () => {
    setIsZoomed(true);
    triggerFlip();
  };
  const handlePointHoverEnd = () => setIsZoomed(false);

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#0a0a0a] text-white pb-24 mt-10 transition-all duration-300 ${
        isInside ? "cursor-none" : "cursor-auto"
      }`}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      onMouseMove={handleMouseMove}
    >
      {/* ===== Custom Cursor ===== */}
      {isInside && (
        <motion.div
          style={{ translateX: smoothX, translateY: smoothY }}
          className="fixed top-0 left-0 z-50 pointer-events-none w-12 h-12"
        >
          <Image
            src={cursor}
            alt="custom magnifier cursor"
            width={58}
            height={58}
            className="object-contain"
          />
        </motion.div>
      )}

      {/* ===== Top Wave ===== */}
      <div className="absolute top-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[120px] md:h-[150px] -mt-[1px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="2">
              <stop offset="0%" stopColor="#D7E3F5" />
              <stop offset="0%" stopColor="#E8EDFA" />
              <stop offset="100%" stopColor="#F8FAFF" />             
            </linearGradient>
          </defs>

          <path
            d="M0,40 L360,110 L900,30 L1440,90 L1440,0 L0,0 Z"
            fill="url(#waveGradient)"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* ===== Content ===== */}
      <div className="relative max-w-6xl mx-auto flex flex-col min-h-[70vh] items-center px-6 md:px-8 mt-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-semibold mt-10 text-center josefin-sans mb-16"
        >
          <span className="text-[#4da3ff] underline">Hover</span> the resume,
          <br /> and watch it
        </motion.h2>

        <div className="relative flex justify-center items-center mt-10">
          {/* ===== Flip Card with Zoom Effect ===== */}
          <motion.div
            onMouseEnter={triggerFlip}
            animate={{
              rotateY: isFlipped ? 180 : 0,
              scale: isZoomed ? 1.08 : 1,
            }}
            transition={{
              rotateY: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.4, ease: "easeOut" },
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-[240px] sm:w-[300px] md:w-[380px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border-[2px] border-white/80 bg-white z-10"
          >
            {/* FRONT */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Image
                src={resumeImages[imgIndex]}
                alt="Resume Front"
                fill
                quality={75}
                className="object-cover"
              />
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                src={resumeImages[(imgIndex + 1) % resumeImages.length]}
                alt="Resume Back"
                fill
                quality={75}
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* ===== Interactive Points ===== */}
          <div className="absolute hidden md:flex items-center gap-0 right-[353px] top-[14%]">
            <motion.p
              onHoverStart={handlePointHoverStart}
              onHoverEnd={handlePointHoverEnd}
              whileHover={{ scale: 1.25, color: "#4da3ff" }}
              transition={{ type: "spring", stiffness: 250, damping: 10 }}
              className="text-xl z-10 text-gray-100 -mr-5 josefin-sans whitespace-nowrap mb-28 cursor-none  select-none"
            >
              Creative Direction
            </motion.p>
            <svg
              className="relative z-0 pointer-events-none"
              width="320"
              height="210"
              viewBox="0 0 190 170"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M222 161C143 145 65 130 0 40"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="0" cy="40" r="8" fill="#ffffff" />
            </svg>
          </div>

          <div className="absolute hidden md:flex items-center gap-0 left-[320px] top-[14%]">
            <svg
              width="280"
              height="140"
              viewBox="0 0 280 140"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
            >
              <path
                d="M0,120 C80,80 160,60 260,40"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="260" cy="40" r="8" fill="#ffffff" />
            </svg>
            <motion.p
              onHoverStart={handlePointHoverStart}
              onHoverEnd={handlePointHoverEnd}
              whileHover={{ scale: 1.25, color: "#4da3ff" }}
              transition={{ type: "spring", stiffness: 250, damping: 10 }}
              className="text-xl z-10 font-medium text-gray-100 mb-14  josefin-sans whitespace-nowrap text-right -ml-2 cursor-none select-none"
            >
              UI/UX Design
            </motion.p>
          </div>

          <div className="absolute hidden md:flex items-center gap-3 right-[320px] bottom-[22%]">
            <motion.p
              onHoverStart={handlePointHoverStart}
              onHoverEnd={handlePointHoverEnd}
              whileHover={{ scale: 1.25, color: "#4da3ff" }}
              transition={{ type: "spring", stiffness: 250, damping: 10 }}
              className="text-xl josefin-sans mb-30 text-gray-100 whitespace-nowrap cursor-none select-none"
            >
              Development
            </motion.p>
            <svg
              width="280"
              height="160"
              viewBox="0 0 280 160"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
            >
              <circle cx="10" cy="20" r="8" fill="#ffffff" />
              <path
                d="M10 20 C40 10, 70 200, 230 140"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          <div className="absolute hidden md:flex items-center gap-2 left-[320px] bottom-[22%]">
            <svg
              width="280"
              height="160"
              viewBox="0 0 280 160"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
            >
              <path
                d="M1 271C-9-4 154 19 183 117 C192 145 210 160 260 60"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="260" cy="60" r="8" fill="#ffffff" />
            </svg>
            <motion.p
              onHoverStart={handlePointHoverStart}
              onHoverEnd={handlePointHoverEnd}
              whileHover={{ scale: 1.25, color: "#4da3ff" }}
              transition={{ type: "spring", stiffness: 250, damping: 10 }}
              className="text-xl z-10 font-medium text-gray-100 mb-10 josefin-sans whitespace-nowrap text-right -ml-2 cursor-none select-none"
            >
              Brand Identity
            </motion.p>
          </div>
        </div>

        {/* ===== Mobile Points ===== */}
        <div className="flex flex-col items-center justify-center gap-3 mt-10 md:hidden">
          {[
            "🎨 Creative Direction",
            "💡 UI/UX Design",
            "💻 Development",
            "🏷️ Brand Identity",
          ].map((point, i) => (
            <motion.div
              key={i}
              onHoverStart={handlePointHoverStart}
              onHoverEnd={handlePointHoverEnd}
              whileHover={{ scale: 1.1, color: "#4da3ff" }}
              className="bg-[#1a1a1a] px-4 py-2 rounded-xl text-gray-200 text-sm sm:text-base josefin-sans shadow-lg border border-white/10 cursor-none select-none"
            >
              {point}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-gray-400 mt-16 text-sm max-w-md mx-auto text-center"
        >
          Hover on points or resume to trigger a jumpy flip and smooth zoom
          animation.
        </motion.p>
      </div>
    </section>
  );
}
