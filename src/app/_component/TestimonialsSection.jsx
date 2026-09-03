"use client";
import { motion } from "framer-motion";
import { Star, Quote, Building2 } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Senior Full-Stack Engineer",
    company: "Hired at Tier-1 FinTech · Bengaluru",
    initials: "PS",
    color: "bg-[#021F81]",
    quote:
      "My resume kept getting rejected before the first recruiter screen. AchiVAI flagged that my previous resume was missing 6 key Kubernetes and microservices keywords listed in the job description. After applying the AI rewrites, I secured 3 interviews in two weeks and signed a major offer.",
  },
  {
    name: "Rahul Verma",
    role: "Lead Product Manager",
    company: "Transitioned to Global SaaS · Remote",
    initials: "RV",
    color: "bg-[#0284c7]",
    quote:
      "The ATS score diagnostic and keyword gap analyzer are phenomenal. Being able to paste the job description and immediately see which requirements were missing made tailoring effortless. The resulting single-column PDF passed Greenhouse with zero issues.",
  },
  {
    name: "Ananya Iyer",
    role: "Data & ML Engineer",
    company: "Hired at Analytics Unicorn · Pune",
    initials: "AI",
    color: "bg-[#7c3aed]",
    quote:
      "AchiVAI transformed my bullet points from passive job duties into quantifiable achievement statements with clear percentages and metrics. Upgrading to the one-time Premium plan was the best career investment I made this year.",
  },
  {
    name: "Devendra Patel",
    role: "New Grad / Software Engineer",
    company: "Campus to Full-Time Tech Hire · Hyderabad",
    initials: "DP",
    color: "bg-[#059669]",
    quote:
      "As a fresher with no previous corporate experience, I was struggling to clear automated campus filtering rounds. AchiVAI helped me properly format my academic projects, hackathons, and core CS fundamentals into an ATS-verified format.",
  },
  {
    name: "Sneha Mukherjee",
    role: "Product Marketing Manager",
    company: "Enterprise SaaS · Mumbai",
    initials: "SM",
    color: "bg-[#ea580c]",
    quote:
      "Other resume builders give you flashy graphic templates that look great on Dribbble but completely fail Workday and Taleo scanners. AchiVAI is the only tool that focuses on what recruiters actually search for.",
  },
  {
    name: "Karan Mehta",
    role: "Cloud Solutions Architect",
    company: "Cloud Consulting · Delhi NCR",
    initials: "KM",
    color: "bg-[#db2777]",
    quote:
      "Saved hours of manual editing. The real-time live preview and instant template switching made comparing layouts effortless. I recommend AchiVAI to every engineer in my network looking for their next move.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative josefin-sans w-full py-24 px-6 overflow-hidden bg-white">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#4da3ff]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3">
          Verifiable Candidate Success Stories
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Loved by <span className="underline decoration-[#021F81]/30">Job Seekers</span> Everywhere
        </h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg">
          Real results from engineers, product managers, analysts, and freshers who beat the ATS with AchiVAI.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-14">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.12, duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="bg-slate-50 border border-gray-200 rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:border-[#021F81]/25 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Quote className="h-7 w-7 text-[#021F81]/20 fill-current" />
                <Stars />
              </div>
              <p className="text-gray-700 leading-relaxed text-sm flex-1 mb-6">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200/80 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${t.color} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}
              >
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs font-medium text-gray-600">{t.role}</p>
                <p className="text-[11px] text-blue-700 mt-0.5">{t.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}