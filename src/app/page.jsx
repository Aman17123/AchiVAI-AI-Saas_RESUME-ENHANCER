"use client";

import dynamic from "next/dynamic";
import Navbar from "./_component/Navbar";
import Hero from "./_component/Hero";
import HeroResumeSection from "./_component/HeroResumeSection";
import UploadSection from "./_component/Mid";
import Footer from "./_component/Footer";
import HoverResume from "./_component/HoverResume";
import PlansSection from "./_component/PlansSection";
import TestimonialsSection from "./_component/TestimonialsSection";
import FAQSection from "./_component/FAQSection";
import HowItWorksSection from "./_component/HowItWorksSection";
import WhyAchiVAISection from "./_component/WhyAchiVAISection";
import "./globals.css";

// Dynamically import ResumeHighlight (client-side only)
const ResumeHighlight = dynamic(() => import("./_component/ResumeHighlight"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="">
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
