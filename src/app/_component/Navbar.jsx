"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";

export default function Navbar({
  logoColor = "#021F81",
  buttonColor = "#021F81",
  scrollBgColor = "rgba(255,255,255,0.9)",
}) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user);
    };
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 kosugi-maru-regular`}
      style={{
        backgroundColor: scrolled ? scrollBgColor : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-between items-center gap-x-10">

        {/* LOGO */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-semibold select-none hover:opacity-80 transition-opacity flex items-center gap-2"
          style={{ color: logoColor }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: buttonColor }}>
            A
          </span>
          AchiVAI
        </Link>

        {/* BUTTON */}
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm md:text-base text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full hover:opacity-90 transition-all duration-300 shadow-sm"
            style={{ backgroundColor: buttonColor }}
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm md:text-base text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full hover:opacity-90 transition-all duration-300 shadow-sm"
            style={{ backgroundColor: buttonColor }}
          >
            Login / Sign up
          </Link>
        )}
      </div>
    </nav>
  );
}