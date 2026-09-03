"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import { createClient } from "../../lib/supabase";

const plans = [
  {
    name: "Free Forever",
    price: "₹0",
    period: "/ forever",
    tagline: "Essential ATS screening for every job seeker",
    features: [
      "2 AI resume audits & keyword scans / month",
      "Real-time 0–100 ATS compatibility score",
      "Full access to Classic ATS & Modern templates",
      "Unlimited real-time resume editing & preview",
      "Clean vector PDF downloads",
      "Cloud saves to your private account",
    ],
    cta: "Start Free Now",
    href: "/template",
    highlight: false,
  },
  {
    name: "Premium Lifetime",
    price: "₹499",
    period: "/ one-time",
    tagline: "Uncapped AI power for ambitious career moves",
    features: [
      "Unlimited AI resume audits & deep scans",
      "Exact job-description keyword gap matching",
      "AI action-verb rewrites & impact metric suggestions",
      "All ATS-certified templates with custom styling",
      "Unlimited high-resolution PDF exports",
      "Unlimited cloud saves & multiple resume versions",
      "Priority customer & technical support",
      "Zero recurring fees — lifetime access",
    ],
    cta: "Unlock Premium Access",
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

    if (user) {
      router.push("/pricing");
    } else {
      router.push("/login?next=/pricing");
    }
  };

  return (
    <section className="josefin-sans w-full py-24 px-6 bg-[#F6F8FF] border-t border-[#021F81]/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Transparent, Honest Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            Simple Plans to Accelerate Your Career
          </motion.h2>
          <p className="text-gray-600 mt-4 text-base sm:text-lg">
            No sneaky subscriptions. No surprise renewals. Test your resume for free or unlock lifetime unlimited AI analyses with a single one-time payment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#021F81] to-[#011452] text-white shadow-xl ring-2 ring-[#021F81]"
                  : "bg-white text-gray-900 border border-[#021F81]/15 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-bold px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlight ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlight ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-10">
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 ${
                          plan.highlight
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={`text-sm leading-relaxed ${
                          plan.highlight ? "text-slate-200" : "text-gray-700"
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {plan.highlight ? (
                <button
                  onClick={handlePremium}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base bg-white text-[#021F81] hover:bg-gray-100 transition-all shadow-md cursor-pointer text-center"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm text-center"
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Reassurance badge */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-500 font-medium text-center">
          <span className="inline-flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-600" />
            Secured by Razorpay (Cards, UPI, Net Banking)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            Instant Activation & Zero Subscription Lock-in
          </span>
        </div>
      </div>
    </section>
  );
}