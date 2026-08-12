"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LogOut, FileText, Trash2, Sparkles } from "lucide-react";
import { createClient } from "../../lib/supabase";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const client = createClient();
    setSupabase(client);
    client.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      loadResumes(client, data.user.id);
    });
  }, [router]);

  const loadResumes = async (client, userId) => {
    setLoading(true);
    try {
      const { data } = await client
        .from("resumes")
        .select("id, name, template, updated_at, created_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      setResumes(data || []);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleDelete = async (id) => {
    if (!supabase) return;
    const ok = window.confirm("Delete this resume? This cannot be undone.");
    if (!ok) return;
    await supabase.from("resumes").delete().eq("id", id);
    setResumes((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F6F8FF] josefin-sans">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#021F81]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#021F81] text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              A
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 leading-tight">
                Dashboard
              </h1>
              <p className="text-xs text-slate-500 leading-tight">
                AchiVAI Resume Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-500 hidden sm:block">
                {user.email}
              </span>
            )}
            <Link
              href="/analysis"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#021F81] hover:text-[#031a66] transition-colors"
            >
              <Sparkles className="h-4 w-4" /> AI Analysis
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[#021F81] font-semibold tracking-wide uppercase text-sm mb-1">
              {user
                ? `Welcome, ${user.email.split("@")[0] || "back"}`
                : "Welcome back"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              {resumes.length > 0
                ? `You have ${resumes.length} resume${resumes.length === 1 ? "" : "s"}`
                : "Your resumes"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pick a template or keep building on a saved resume.
            </p>
          </div>

          <Link
            href="/template"
            className="inline-flex items-center justify-center gap-2 bg-[#021F81] hover:bg-[#031a66] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> New Resume
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white/60 animate-pulse rounded-2xl border border-[#021F81]/10"
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center py-20 bg-white rounded-3xl border border-[#021F81]/10 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#021F81]/10 mb-6">
              <FileText className="h-8 w-8 text-[#021F81]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              No resumes yet
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-8 max-w-sm mx-auto">
              Create your first resume with one of our ATS-friendly templates
              and get instant AI feedback.
            </p>
            <Link
              href="/template"
              className="inline-flex items-center gap-2 bg-[#021F81] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#031a66] shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Plus className="h-4 w-4" /> Create a Resume
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className="bg-white rounded-2xl border border-[#021F81]/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-14 bg-[#F6F8FF] rounded-xl border border-[#021F81]/10 flex items-center justify-center mb-5">
                    <FileText className="h-6 w-6 text-[#021F81]" />
                  </div>
                  <h3 className="font-semibold text-slate-900 truncate text-lg">
                    {r.name || "Untitled Resume"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium capitalize px-2.5 py-0.5 rounded-full bg-[#021F81]/10 text-[#021F81]">
                      {r.template}
                    </span>
                    <span className="text-xs text-slate-400">
                      Updated {formatDate(r.updated_at || r.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/template/${r.template}?resume=${r.id}`}
                    className="text-sm font-semibold text-[#021F81] hover:text-[#031a66] hover:underline"
                  >
                    Edit resume
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
