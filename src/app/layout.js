import { Geist, Geist_Mono } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AchiVAI — AI Resume Builder",
    template: "%s | AchiVAI",
  },
  description:
    "AchiVAI is an AI-powered resume builder that scans your resume, checks it against the job description, and helps you beat the ATS to get hired faster.",
  applicationName: "AchiVAI",
keywords: [
    "AI resume builder",
    "ATS resume checker",
    "free resume template",
    "resume optimizer",
    "job application helper",
    "resume keyword matching",
    "ATS score resume",
    "AI resume analyzer",
    "resume for freshers",
    "Gemini resume analysis",
    "resume builder India",
    "free resume builder",
    "resume feedback AI",
    "job description resume tailoring",
    "ATS friendly resume template",
    "resume PDF export",
    "AchiVAI",
  ],
  authors: [{ name: "Aman Nakoti" }],
  creator: "Aman Nakoti",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AchiVAI — AI Resume Builder",
    description:
      "Beat the ATS and get hired faster. AI scans your resume, finds missing keywords, and gives actionable feedback.",
    url: appUrl,
    siteName: "AchiVAI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AchiVAI — AI Resume Builder: Beat the ATS and get hired faster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AchiVAI — AI Resume Builder",
    description:
      "Beat the ATS and get hired faster with AI-powered resume analysis.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#021F81",
};

const faqStructuredData = [
  {
    q: "What is an ATS and why does it matter?",
    a: "An Applicant Tracking System (ATS) is software recruiters use to scan resumes before a human sees them. AchiVAI tailors your resume to clear the ATS scan and reach a real person.",
  },
  {
    q: "How does the AI analyze my resume?",
    a: "Upload a PDF or DOCX and optionally paste the job description. AchiVAI reads your resume, scores it out of 100, lists matched and missing keywords, and gives section-by-section feedback.",
  },
  {
    q: "Is AchiVAI free?",
    a: "Yes. The Free plan includes 2 AI analyses per month plus unlimited resume building and PDF export. Premium is a one-time upgrade with unlimited analyses.",
  },
  {
    q: "Can I download my resume as a PDF?",
    a: "Yes. Every AchiVAI template exports to a clean, ATS-friendly, print-ready PDF in one click, on the Free plan and Premium alike.",
  },
];

const softwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AchiVAI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: appUrl,
  description:
    "AI-powered resume builder that scans resumes against job descriptions to help you beat ATS systems and get hired.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  author: {
    "@type": "Person",
    name: "Aman Nakoti",
  },
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AchiVAI",
  url: appUrl,
  logo: `${appUrl}/icon.svg`,
  sameAs: ["https://github.com/Aman17123"],
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AchiVAI — AI Resume Builder",
  url: appUrl,
  description:
    "Free AI resume builder that checks your resume against the ATS and helps you beat applicant tracking systems to get hired faster.",
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqStructuredData.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const structuredData = [softwareApp, organizationData, websiteData, faqData];

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${josefin.variable} antialiased`}
      >
        {structuredData.map((item, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}