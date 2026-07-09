import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cusp-game.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/profile`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/lobby`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/offline`, lastModified: now, changeFrequency: "monthly", priority: 0.1 },
  ];
}
