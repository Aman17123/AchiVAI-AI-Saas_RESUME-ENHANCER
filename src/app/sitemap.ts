export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const base = new URL(appUrl).origin;

  const now = new Date();

  const routes = [
    "",
    "/template",
    "/upload",
    "/login",
    "/dashboard",
    "/analysis",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/template" ? "monthly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}