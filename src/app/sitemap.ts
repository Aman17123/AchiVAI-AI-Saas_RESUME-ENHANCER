export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const base = new URL(appUrl).origin;

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