import { MetadataRoute } from "next";

/**
 * Next.js dynamic sitemap generator.
 * Fulfills production-ready crawler index configuration.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jatashankar.org";

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "#about", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "#courses", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "#facilities", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "#gallery", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "#faculty", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "#placements", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "#contact", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
