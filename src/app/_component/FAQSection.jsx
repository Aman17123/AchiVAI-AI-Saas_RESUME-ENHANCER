"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export const homepageFaqs = [
  {
    q: "What is an Applicant Tracking System (ATS) and why does it matter?",
    a: "An Applicant Tracking System (ATS) is enterprise software used by over 98% of Fortune 500 companies and growing startups (such as Greenhouse, Workday, Lever, and Taleo) to automatically screen and filter candidate resumes before human recruiters ever review them. The ATS parses document text, identifies key technical and soft skills, and ranks applicants by relevance score. Resumes with unreadable multi-column formatting, graphics, or missing keywords are automatically filtered out. AchiVAI formats and tailors your resume so it clears automated scans with flying colors.",
  },
  {
    q: "How does AchiVAI analyze and score my resume?",
    a: "Upload your resume in PDF or DOCX format and optionally paste the target job description. AchiVAI's Gemini AI engine evaluates your resume across four core pillars: Keyword Match Rate, Metric-Driven Achievements, Structural Formatting, and Section Completeness. You receive a diagnostic 0–100 score, a clear hiring probability verdict, a list of matched and missing keywords, and section-by-section bullet rewrites.",
  },
  {
    q: "What makes AchiVAI different from Canva or generic resume builders?",
    a: "Tools like Canva, Photoshop, or generic web builders create visually artistic templates that use complex tables, floating text boxes, and non-standard vector elements. When an ATS parser reads these files, text gets scrambled or completely dropped into an unreadable string. AchiVAI's templates (Classic ATS and Modern Professional) are strictly built with semantic hierarchy and parser-tested fonts to guarantee 100% readability by automated systems.",
  },
  {
    q: "Which ATS software platforms is AchiVAI compatible with?",
    a: "AchiVAI is engineered and tested against all major corporate ATS platforms, including Greenhouse, Workday, Lever, Oracle Taleo, iCIMS, SAP SuccessFactors, SmartRecruiters, JazzHR, and BambooHR.",
  },
  {
    q: "How does semantic keyword matching work without unnatural keyword stuffing?",
    a: "Older advice suggested cramming invisible white text or random lists of keywords onto your resume, which modern ATS algorithms immediately detect and flag as spam. AchiVAI uses contextual semantic matching: it shows you how to integrate missing industry terms, methodologies (like Agile, CI/CD, Microservices), and technical tools naturally into your work experience bullet points and skill summaries.",
  },
  {
    q: "Does AchiVAI work for freshers, college graduates, and career switchers?",
    a: "Yes! AchiVAI adapts its evaluation based on your career stage. For freshers and students, it emphasizes academic coursework, capstone projects, coding hackathons, technical skills, and leadership roles. For career changers, it highlights transferable skills and aligns past accomplishments with target industry expectations.",
  },
  {
    q: "Can I customize different resumes for different job postings?",
    a: "Absolutely. In fact, tailoring your resume for every distinct role is the #1 strategy to maximize interview callbacks. With AchiVAI, you can duplicate resumes in one click, re-run keyword audits against new job descriptions, and store multiple tailored versions in your private account.",
  },
  {
    q: "Can I download my resume as an ATS-safe PDF?",
    a: "Yes. Every resume created or edited on AchiVAI exports directly to a high-resolution, print-ready vector PDF in one click. The exported PDF preserves all selectable text, standardized margins, and clean fonts across both Free and Premium tiers.",
  },
  {
    q: "Do I need to pay or create an account to get started?",
    a: "You can build, edit, preview, and export resumes from our template studio without creating an account. Signing in with Google or email unlocks 2 free AI resume analyses per month and securely saves your work to cloud storage so you can access it anywhere.",
  },
  {
    q: "What does the Premium plan include and are there recurring subscriptions?",
    a: "AchiVAI Premium is a one-time upgrade of ₹499 with lifetime access. It gives you unlimited AI resume audits, deep job-description keyword matching, unlimited cloud saves, and priority support. There are NO recurring monthly charges, NO auto-renewals, and NO hidden fees.",
  },
  {
    q: "How are payments handled?",
    a: "All payments are processed securely through Razorpay using end-to-end encryption. We support Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking across all major banks.",
  },
  {
    q: "Is my resume and career information private and confidential?",
    a: "Yes, 100%. We take candidate privacy seriously. Your resume, personal contact details, and uploaded files are stored in your own encrypted cloud database and are never sold, rented, or shared with third-party advertisers or recruitment agencies.",
  },
];

function FaqItem({ faq, open, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-colors hover:border-[#021F81]/25">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
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
    <section className="josefin-sans w-full py-24 px-6 bg-white border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#021F81] text-xs font-semibold mb-3">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Everything You Need to Know</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Frequently Asked <span className="underline decoration-[#021F81]/30">Questions</span>
        </h2>
        <p className="text-gray-600 mt-3 text-sm sm:text-base">
          Got questions about ATS compatibility, AI scoring, or resume templates? We have answers.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto mt-12 space-y-3.5">
        {homepageFaqs.map((faq, i) => (
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