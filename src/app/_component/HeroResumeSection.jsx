"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import "../globals.css";

export default function HeroResumeSection() {
  return (
    <section className="relative w-full  overflow-hidden ">
      <svg xmlns="http://www.w3.org/2000/svg" width="399" height="560" viewBox="0 0 599 560" fill="none" className="-mt-50">
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
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl sm:text-left text-center font-semibold leading-tight text-gray-900 josefin-sans"
          >
            Fix your resume and enhance its chances <br />
            <span className="text-gray-800">
              of landing an{" "}
              <span className="text-[#ff7b00] font-bold">interview.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600  sm:text-left text-center leading-relaxed josefin-sans text-base sm:text-lg"
          >
            Enhance your resume and create different chances of getting calls
            from big FANG companies.
          </motion.p>

          {/* === Company Logos === */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className=" flex items-center gap-4 sm:gap-6 mt-4"
          >
            <Image
              src="/images/logos/google.svg"
              alt="Google"
              width={80}
              height={40}
              className="object-contain"
            />
            <Image
              src="/images/logos/amazon.svg"
              alt="Amazon"
              width={80}
              height={40}
              className="object-contain"
            />
            <Image
              src="/images/logos/nvidia.svg"
              alt="Nvidia"
              width={80}
              height={40}
              className="object-contain"
            />
            <Image
              src="/images/logos/tiktok.svg"
              alt="TikTok"
              width={80}
              height={50}
              className="object-contain"
            />
          </motion.div>

          {/* === Button === */}
        <div className="flex sm:justify-start justify-center gap-5">
          <motion.a
            href="/upload"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="
              sm:mt-8 w-fit bg-black text-white text-sm sm:text-base
              px-6 py-3 rounded-md shadow-md hover:scale-105 hover:bg-[#ff7b00]
              transition-transform cursor-pointer
            "
          >
            Upload Resume
          </motion.a>

          <motion.a
            href="/template"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="
              sm:mt-8 w-fit bg-black text-white text-sm sm:text-base
              px-6 py-3 rounded-md shadow-md hover:scale-105 hover:bg-[#ff7b00]
              transition-transform cursor-pointer
            "
          >
            Select Template
          </motion.a>
        </div>


          {/* === Bottom Caption === */}
          <p className="text-sm text-gray-400 mt-4 text-center sm:text-left">
            text of the printing and typesetting industry.
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
          <div className="relative w-[75vw] sm:w-[360px] md:w-[420px] aspect-[3/4] rounded-[24px] shadow-xl overflow-hidden border-[6px] sm:border-[3px] border-white bg-white z-10">
            <Image
              src="https://i.pinimg.com/736x/77/de/37/77de37a4f5877b9b176aff2b6ba650f0.jpg"
              alt="Resume Example"
              fill
              quality={75}
              className="object-cover"
            />
          </div>

          {/* ===== Outline Lines (Hidden on Mobile) ===== */}
          <div className="hidden sm:block absolute w-[380px] h-[480px] border-2 border-[#a0b4cc] rounded-[24px] top-[20px] left-0"></div>

          {/* ===== Small Resume Card (Same position across all sizes) ===== */}
          <div className="absolute right-[-10px] top-[130px] w-[28vw] sm:w-[160px] sm:h-[210px] h-[36vw] rounded-xl  shadow-lg border-[3px] border-white bg-white overflow-hidden z-20">
            <Image
              src="https://i.pinimg.com/1200x/56/7a/11/567a11ce55be09f4101baf1b6a72d030.jpg"
              alt="Mini Resume"
              fill
              quality={75}
              className="object-cover  "
            />
          </div>

          {/* ===== Bottom Decorative Line (Hidden on Mobile) ===== */}
          <div
            className="
              hidden 
              sm:block 
              absolute 
              w-[360px] sm:w-[420px] 
              h-[100px] sm:h-[120px] 
              border-2 border-[#a0b4cc] 
              rounded-[24px] 
              top-[280px] sm:top-[300px] 
              left-[120px] sm:left-[170px]
            "
          ></div>
        </motion.div>

      </div>
    </section>
  );
}
