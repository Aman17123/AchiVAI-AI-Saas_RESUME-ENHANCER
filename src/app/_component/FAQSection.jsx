"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is an ATS and why does it matter?",
    a: "An Applicant Tracking System (ATS) is software recruiters use to scan resumes before a human sees them. It filters applications by keywords and formatting, so many great resumes never get seen. AchiVAI tailors your resume to match the job description so it clears the ATS scan and reaches a real person.",
  },
  {
    q: "How does the AI analyze my resume?",
    a: "Upload a PDF or DOCX and optionally paste the job description. Our AI reads your resume, scores it out of 100, lists matched and missing keywords, and gives section-by-section feedback with actionable suggestions.",
  },
  {
    q: "Do I need an account to use AchiVAI?",
    a: "You can build and edit resumes without an account. Sign in with email or Google to save resumes to the cloud and unlock AI analysis. Every free account gets 2 AI analyses per month.",
  },
  {
    q: "Can I download my resume as a PDF?",
    a: "Yes. Every template exports to a clean, ATS-friendly, print-ready PDF in one click — on the Free plan and Premium alike.",
  },
  {
    q: "What does Premium include?",
    a: "Premium is a one-time ₹499 upgrade for unlimited AI analyses, job-description matching, unlimited downloads, and unlimited cloud saves. The Free plan offers 2 analyses per month.",
  },
  {
    q: "How do payments work?",
    a: "Payments are processed securely by Razorpay with cards, UPI, and net banking. It's a one-time payment with no subscription and no auto-renewal.",
  },
  {
    q: "Does it work for freshers and experienced professionals?",
    a: "Yes. AchiVAI analyses resumes for freshers, students, and experienced professionals alike. For freshers it highlights education, projects, and skills; for experienced candidates it evaluates experience bullets, impact, and industry keywords.",
  },
  {
    q: "Can I analyze without a job description?",
    a: "Absolutely. Analysis works on the resume alone, scanning it for common ATS keywords and readability. Pasting the job description makes the match far more precise, but it is completely optional.",
  },
  {
    q: "Is my data private?",
    a: "Your resumes are stored in your own private account and are only ever visible to you. We never sell or share your resume or job details.",
  },
];

function FaqItem({ faq, open, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-[#021F81]/10 text-[#021F81] flex items-center justify-center"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="josefin-sans w-full py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3">
          FAQ
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Questions? <span className="underline decoration-[#021F81]/30">Answered.</span>
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto mt-12 space-y-3">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}