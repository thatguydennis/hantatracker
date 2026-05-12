import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const routes: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/science", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/feedback", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/legal", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
