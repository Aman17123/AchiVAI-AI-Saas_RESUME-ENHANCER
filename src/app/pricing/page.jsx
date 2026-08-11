"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, Zap, Crown } from "lucide-react";
import Navbar from "../_component/Navbar";

function loadCheckoutScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment gateway."));
    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  const [plan, setPlan] = useState("guest");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => {
        setPlan(d.plan || "guest");
        setEmail(d.email || "");
      })
      .catch(() => {});
  }, []);

  const handlePurchase = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (plan === "guest") {
        throw new Error("Please sign in to purchase Premium.");
      }

      const res = await fetch("/api/razorpay/create-order", { method: "POST" });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not start payment.");

      await loadCheckoutScript();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AchiVAI",
        description: "AchiVAI Premium — unlimited AI resume analysis",
        order_id: order.orderId,
        prefill: email ? { email } : undefined,
        theme: { color: "#021F81" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const data = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(data.error || "Verification failed.");
            setPlan("premium");
            setMessage("Payment successful! You're now on Premium. 🎉");
          } catch (err) {
            setError(err.message || "Payment verification failed.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. You can try again.");
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar logoColor="#021F81" buttonColor="#021F81" scrollBgColor="rgba(255,255,255,0.95)" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Simple pricing for <span className="text-blue-600">serious job hunters</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Start free, upgrade when you want unlimited AI analysis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Free</h2>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              ₹0
              <span className="text-sm font-normal text-slate-500"> / forever</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600 text-left flex-1">
              {[
                "2 AI resume analyses / month",
                "All 4 ATS-friendly templates",
                "Unlimited resume editing",
                "PDF download",
                "Save resumes to your account",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/template"
                className="block w-full text-center border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {plan === "free" ? "Current plan" : "Start free"}
              </Link>
            </div>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-[#021F81] rounded-2xl shadow-xl p-8 flex flex-col text-white"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold">Premium</h2>
            </div>
            <p className="text-3xl font-bold">
              ₹499
              <span className="text-sm font-normal text-white/70"> / one-time</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/90 text-left flex-1">
              {[
                "Unlimited AI resume analyses",
                "Job description keyword matching",
                "All 4 ATS-friendly templates",
                "Unlimited PDF downloads",
                "Unlimited cloud saves",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {plan === "premium" ? (
                <div className="text-center bg-white/10 rounded-lg px-4 py-2.5 text-sm font-medium">
                  ✅ You&apos;re on Premium
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-full bg-white text-[#021F81] hover:bg-amber-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Starting...
                    </>
                  ) : (
                    <>Go Premium</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {error && (
          <p className="mt-8 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-3 px-4 max-w-md mx-auto">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-8 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg py-3 px-4 max-w-md mx-auto">
            {message}
          </p>
        )}

        <p className="mt-10 text-xs text-slate-400">
          Secure payments by Razorpay. One-time payment, no subscription required.
        </p>
      </main>
    </div>
  );
}