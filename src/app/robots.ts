import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
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

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/analysis", "/api/", "/auth/"],
      },
      {
        // Block AI training bots from scraping your content
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}