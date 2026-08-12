"use client";

import dynamic from "next/dynamic";
import Navbar from "./_component/Navbar";
import Hero from "./_component/Hero";
import "./globals.css";

// Below-the-fold components dynamic imports (code-splitting)
const HowItWorksSection = dynamic(() => import("./_component/HowItWorksSection"));
const ResumeHighlight = dynamic(() => import("./_component/ResumeHighlight"), { ssr: false });
const HeroResumeSection = dynamic(() => import("./_component/HeroResumeSection"));
const UploadSection = dynamic(() => import("./_component/Mid"));
const WhyAchiVAISection = dynamic(() => import("./_component/WhyAchiVAISection"));
const PlansSection = dynamic(() => import("./_component/PlansSection"));
const TestimonialsSection = dynamic(() => import("./_component/TestimonialsSection"));
const HoverResume = dynamic(() => import("./_component/HoverResume"));
const FAQSection = dynamic(() => import("./_component/FAQSection"));
const Footer = dynamic(() => import("./_component/Footer"));

export default function HomePage() {
  return (
    <div>
      <Navbar />    
      <Hero />
      <HowItWorksSection />
      <ResumeHighlight />
      <HeroResumeSection />
      <UploadSection />
      <WhyAchiVAISection />
      <PlansSection />
      <TestimonialsSection />
      <HoverResume />
      <FAQSection />
      <Footer />
    </div>
  );
}
