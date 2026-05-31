import { Metadata } from "next";
import { getWebsiteSettings } from "../services/settings.service";

/**
 * Generates dynamic SEO metadata using Firestore website settings.
 * If settings are missing or any internal error occurs, safe fallback values are used.
 *
 * @returns A promise resolving to a Next.js Metadata object.
 */
export async function generateWebsiteMetadata(): Promise<Metadata> {
  try {
    const settings = await getWebsiteSettings();

    const title = settings.metaTitle || "Jatashankar Group of Institutions - Balaghat";
    const description = settings.metaDescription || "Providing world-class medical training and allied health sciences education in Balaghat, Madhya Pradesh.";
    
    // Format keywords: handle comma-separated string, convert to array
    const keywords = settings.metaKeywords
      ? settings.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : ["Healthcare", "Paramedical", "Physiotherapy", "Balaghat", "Allied Health", "Jatashankar Group"];

    // Open Graph image fallback
    const ogImageUrl = settings.seoImageUrl || "/branding/homeimg.jpeg";
    
    // Twitter image fallback
    const twitterImageUrl = settings.seoImageUrl || "/branding/homeimg.jpeg";

    // Favicon fallback
    const faviconUrl = settings.faviconUrl || "/favicon.ico";

    let metadataBase: URL | undefined = undefined;
    try {
      const websiteUrl = settings.website || "https://jatashankar.org";
      metadataBase = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      metadataBase = new URL("https://jatashankar.org");
    }

    return {
      metadataBase,
      title,
      description,
      keywords,
      verification: settings.googleSearchConsoleVerification
        ? { google: settings.googleSearchConsoleVerification }
        : undefined,
      openGraph: {
        title: settings.ogTitle || title,
        description: settings.ogDescription || description,
        images: [
          {
            url: ogImageUrl,
            alt: settings.ogTitle || title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: settings.twitterTitle || title,
        description: settings.twitterDescription || description,
        images: [twitterImageUrl],
      },
      icons: {
        icon: [
          {
            url: faviconUrl,
            type: "image/x-icon",
          },
        ],
        shortcut: [faviconUrl],
        apple: [faviconUrl],
      },
    };
  } catch (error) {
    console.error("Critical failure during generateWebsiteMetadata:", error);
    
    // Ultimate production-safe fallback metadata
    const fallbackTitle = "Jatashankar Group of Institutions - Balaghat";
    const fallbackDesc = "Providing world-class medical training and allied health sciences education in Balaghat, Madhya Pradesh.";
    const fallbackKeywords = ["Healthcare", "Paramedical", "Physiotherapy", "Balaghat", "Allied Health", "Jatashankar Group"];
    const fallbackImage = "/branding/homeimg.jpeg";
    const fallbackFavicon = "/favicon.ico";
    const fallbackWebsite = "https://jatashankar.org";

    return {
      metadataBase: new URL(fallbackWebsite),
      title: fallbackTitle,
      description: fallbackDesc,
      keywords: fallbackKeywords,
      verification: undefined,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDesc,
        images: [
          {
            url: fallbackImage,
            alt: fallbackTitle,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [fallbackImage],
      },
      icons: {
        icon: [
          {
            url: fallbackFavicon,
            type: "image/x-icon",
          },
        ],
        shortcut: [fallbackFavicon],
        apple: [fallbackFavicon],
      },
    };
  }
}
