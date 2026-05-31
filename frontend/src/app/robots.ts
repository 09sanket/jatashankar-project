import { MetadataRoute } from "next";

/**
 * Next.js dynamic robots.txt generator.
 * Configures crawler directives for search engine indexing.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jatashankar.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
