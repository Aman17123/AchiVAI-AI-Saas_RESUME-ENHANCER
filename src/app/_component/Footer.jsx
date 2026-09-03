"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#021845] text-white pt-16 pb-12 px-6 sm:px-10 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <Link href="/" className="text-white text-2xl font-bold tracking-wider mb-3 flex items-center gap-2 select-none">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white text-[#021845] text-base font-extrabold shadow-sm">
                A
              </span>
              <span>AchiVAI</span>
            </Link>
            <p className="text-[#BFD3F2] josefin-sans text-sm leading-relaxed max-w-xs mb-4">
              AI-powered resume builder and ATS score checker. Tailor your resume to pass enterprise Applicant Tracking Systems and land top interviews.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
              <span>100% Private & Encrypted</span>
            </div>
          </div>

          {/* Tools & Builder */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Resume Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BFD3F2] josefin-sans">
              <li>
                <Link href="/upload" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>ATS Resume Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/template" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>AI Resume Builder</span>
                </Link>
              </li>
              <li>
                <Link href="/template/classic" className="hover:text-white transition-colors">
                  Classic ATS Template
                </Link>
              </li>
              <li>
                <Link href="/template/modern" className="hover:text-white transition-colors">
                  Modern Tech Resume
                </Link>
              </li>
              <li>
                <Link href="/template/new" className="hover:text-white transition-colors">
                  Start from Blank Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BFD3F2] josefin-sans">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Lifetime Access
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-white transition-colors">
                  Resume Analysis History
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* ATS Compliance Standards */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              ATS Compatibility
            </h4>
            <ul className="space-y-2 text-xs text-[#BFD3F2] josefin-sans">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                <span>Workday ATS Verified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                <span>Greenhouse Parser Compliant</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                <span>Lever Candidate Scoring Safe</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                <span>Oracle Taleo & iCIMS Tested</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                <span>Clean High-Res Vector PDF</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs text-[#BFD3F2] josefin-sans">
          <p>© {year} AchiVAI. All Rights Reserved. Engineered for candidate success.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-400 fill-current inline" />
            <span>by</span>
            <a
              href="https://github.com/Aman17123"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-blue-300 font-semibold transition-colors"
            >
              Aman Nakoti
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}