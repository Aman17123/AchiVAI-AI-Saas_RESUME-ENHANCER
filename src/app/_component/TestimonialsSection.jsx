"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer · Bengaluru",
    initials: "PS",
    color: "bg-[#021F81]",
    quote:
      "My resume kept getting rejected before the interview stage. AchiVAI found the missing keywords, I added them, and I got 3 callbacks within two weeks.",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager · Remote",
    initials: "RV",
    color: "bg-[#4da3ff]",
    quote:
      "The ATS score alone was worth it. Pasting the job description and seeing exactly what to add made tailoring effortless. The PDF export looks genuinely professional.",
  },
  {
    name: "Ananya Iyer",
    role: "Data Analyst · Pune",
    initials: "AI",
    color: "bg-[#7c3aed]",
    quote:
      "Switched to Premium and never looked back. Unlimited analyses, clean templates, and the suggestions are actually actionable — not generic advice.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative josefin-sans w-full py-24 px-6 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#4da3ff]/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Loved by <span className="underline decoration-[#021F81]/30">job seekers</span> everywhere
        </h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg">
          Real results from people who beat the ATS with AchiVAI.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-14">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm flex flex-col"
          >
            <Quote className="h-8 w-8 text-[#021F81]/15 fill-current" />
            <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base flex-1">
              {t.quote}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${t.color} text-white flex items-center justify-center text-sm font-bold`}
              >
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
              <div className="ml-auto">
                <Stars />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}