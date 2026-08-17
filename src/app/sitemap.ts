import { headers } from "next/headers";

export default async function sitemap() {
  // Priority: env var → request host header → fallback
  let base: string;

  if (process.env.NEXT_PUBLIC_APP_URL) {
    base = new URL(process.env.NEXT_PUBLIC_APP_URL).origin;
  } else {
    // Auto-detect from request headers (works on Vercel without env var)
    const headersList = await headers();
    const host = headersList.get("host") ?? "";
    const proto = host.startsWith("localhost") ? "http" : "https";
    base = `${proto}://${host}`;
  }

  const now = new Date();

  const routes = [
    { path: "", freq: "weekly", priority: 1.0 },
    { path: "/template", freq: "monthly", priority: 0.9 },
    { path: "/pricing", freq: "monthly", priority: 0.9 },
    { path: "/upload", freq: "weekly", priority: 0.7 },
    { path: "/login", freq: "yearly", priority: 0.5 },
  ].map(({ path, freq, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  return routes;
}