"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "../../lib/supabase";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/ forever",
    tagline: "For trying AchiVAI out",
    features: [
      "2 AI resume analyses / month",
      "All 4 ATS-friendly templates",
      "Unlimited resume editing",
      "PDF download",
      "Save to your account",
    ],
    cta: "Start Free",
    href: "/template",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/ one-time",
    tagline: "For serious job hunters",
    features: [
      "Unlimited AI resume analyses",
      "Job description keyword matching",
      "All 4 ATS-friendly templates",
      "Unlimited PDF downloads",
      "Unlimited cloud saves",
      "Priority support",
    ],
    cta: "Go Premium",
    href: "/pricing",
    highlight: true,
  },
];

export default function PlansSection() {
  const router = useRouter();

  const handlePremium = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check current plan; signed-in + already premium users can go straight to /pricing
    if (user) {
      router.push("/pricing");
    } else {
      router.push("/login?next=/pricing");
    }
  };

  return (
    <section className="relative josefin-sans w-full py-24 px-6 overflow-hidden">
      {/* Soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#021F81]/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3">
          Pricing
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Start free. Upgrade when you&apos;re <span className="underline decoration-[#021F81]/30">serious.</span>
        </h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg">
          Every plan includes every template. Upgrade only if you want unlimited
          AI analysis.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-14">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className={`relative rounded-3xl p-8 flex flex-col ${
              plan.highlight
                ? "bg-[#021F81] text-white shadow-2xl scale-[1.02] md:scale-105"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            )}

            <h3
              className={`text-xl font-semibold ${
                plan.highlight ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-sm mt-1 ${
                plan.highlight ? "text-white/70" : "text-gray-500"
              }`}
            >
              {plan.tagline}
            </p>

            <p className="mt-6 text-4xl font-bold">
              {plan.price}
              <span
                className={`text-sm font-normal ${
                  plan.highlight ? "text-white/60" : "text-gray-500"
                }`}
              >
                {plan.period}
              </span>
            </p>

            <ul className="mt-8 space-y-3 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight
                        ? "bg-white/15 text-amber-300"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {plan.highlight ? (
              <button
                onClick={handlePremium}
                className="mt-8 text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer bg-white text-[#021F81] hover:bg-amber-300 hover:-translate-y-0.5"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                href={plan.href}
                className="mt-8 text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer border-2 border-[#021F81] text-[#021F81] hover:bg-[#021F81] hover:text-white hover:-translate-y-0.5"
              >
                {plan.cta}
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}