"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import bg from "../../../public/images/bg.png";
import { createClient } from "../../lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const oauthError = searchParams.get("error");

  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    oauthError ? `Sign-in failed: ${oauthError}` : "",
  );
  const [message, setMessage] = useState("");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${appUrl}/auth/callback` },
        });
        if (error) throw error;
        setMessage(
          "Account created! Check your email to confirm, then sign in.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email to receive a magic link.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setMessage("Magic link sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email to reset your password.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/dashboard`,
      });
      if (error) throw error;
      setMessage("Password reset link sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#021F81]/10 shadow-xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#021F81] via-[#5676ff] to-[#8fa7ff]" />

      <div className="p-8 sm:p-10 flex flex-col space-y-6 josefin-sans">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-semibold text-[#021F81] hover:opacity-80 transition-opacity"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#021F81] text-white text-base font-bold">
              A
            </span>
            AchiVAI
          </Link>

          <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-2 mt-6">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            {mode === "signup"
              ? "Start building winning resumes"
              : "Sign in to continue"}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {mode === "signup"
              ? "Join AchiVAI and let AI do the heavy lifting."
              : "Manage your resumes and AI analysis."}
          </p>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#021F81]/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#F6F8FF] cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin text-[#021F81]" />
          ) : (
            <Image
              src="/images/logos/google.svg"
              alt="Google"
              width={16}
              height={16}
            />
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#F6F8FF] border border-slate-200 focus:ring-2 focus:ring-[#021F81]/30 focus:border-[#021F81] h-11 w-full rounded-xl px-3 py-1 text-base text-slate-900 outline-none transition-colors md:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#F6F8FF] border border-slate-200 focus:ring-2 focus:ring-[#021F81]/30 focus:border-[#021F81] h-11 w-full rounded-xl px-3 py-1 text-base text-slate-900 outline-none transition-colors md:text-sm"
              />
            </div>
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="text-[#021F81] hover:underline font-medium cursor-pointer"
              >
                Send magic link
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-slate-500 hover:text-[#021F81] font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#021F81] text-white px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#031a66] hover:shadow-md cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          <p>
            {mode === "signup" ? "Already have an account?" : "New to AchiVAI?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setError("");
                setMessage("");
              }}
              className="text-[#021F81] font-semibold hover:underline cursor-pointer"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400">
          Free plan · 2 AI analyses / month · No card required
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F6F8FF]  px-4 py-12">
      {/* Background image */}
      <Image
        src={bg}
        alt="background"
        fill
        priority
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-[#F6F8FF]/20" />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#021F81]/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#021F81]/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#021F81]/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full flex justify-center"
      >
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
