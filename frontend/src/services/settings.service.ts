import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface WebsiteSettings {
  instituteName: string;
  instituteNameHindi: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  website: string;
  heroTitle: string;
  heroDescription: string;
  heroBadgeText: string;
  heroCtaPrimaryText: string;
  heroCtaSecondaryText: string;
  heroHighlightText: string;
  metaTitle: string;
  metaDescription: string;
  footerText: string;
  footerDescription: string;
  footerTagline: string;
  footerCtaText: string;
  logoUrl: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  faviconUrl: string;
  seoImageUrl: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
}

const SETTINGS_DOC_ID = "global";

// Fallback/Default values if firestore retrieval fails or document doesn't exist.
export const FALLBACK_SETTINGS: WebsiteSettings = {
  instituteName: "Jatashankar Group of Institutions",
  instituteNameHindi: "जटाशंकर ग्रुप ऑफ़ इंस्टिट्यूशन",
  phone: "09926561016",
  email: "contact@jatashankar.org",
  address: "Balaghat, Madhya Pradesh, India",
  whatsapp: "09926561016",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  website: "https://jatashankar.org",
  heroTitle: "जटाशंकर ग्रुप ऑफ इंस्टिट्यूट बालाघाट",
  heroDescription: "Physiotherapy, X-Ray Technology एवं Allied Healthcare Education के लिए आधुनिक एवं प्रोफेशनल शिक्षण संस्थान",
  heroBadgeText: "Healthcare & Paramedical Institute",
  heroCtaPrimaryText: "अभी आवेदन करें",
  heroCtaSecondaryText: "कॉल करें",
  heroHighlightText: "इंस्टिट्यूट बालाघाट",
  metaTitle: "Jatashankar Group of Institutions - Balaghat",
  metaDescription: "Providing world-class medical training and allied health sciences education in Balaghat, Madhya Pradesh.",
  footerText: "© 2026 Jatashankar Group of Institutions. All rights reserved.",
  footerDescription: "Healthcare, Physiotherapy एवं Allied Health Science Education के क्षेत्र में गुणवत्तापूर्ण एवं आधुनिक शिक्षण संस्थान।",
  footerTagline: "Group of Institutions",
  footerCtaText: "Designed & Developed with ❤️ for Healthcare Education",
  logoUrl: "/branding/logo.jpeg",
  metaKeywords: "Healthcare, Paramedical, Physiotherapy, Balaghat, Allied Health, Jatashankar Group",
  ogTitle: "Jatashankar Group of Institutions",
  ogDescription: "Providing world-class medical training and allied health sciences education in Balaghat, Madhya Pradesh.",
  twitterTitle: "Jatashankar Group of Institutions",
  twitterDescription: "Providing world-class medical training and allied health sciences education in Balaghat, Madhya Pradesh.",
  faviconUrl: "/favicon.ico",
  seoImageUrl: "/branding/homeimg.jpeg",
  googleAnalyticsId: "",
  googleSearchConsoleVerification: "",
};

/**
 * Fetches the global website settings document from Firestore.
 * Handles discrepancies in naming (e.g. hindiName vs instituteNameHindi)
 * and falls back to pre-configured defaults in case of any database errors or missing entries.
 *
 * @returns A promise resolving to the WebsiteSettings object
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        instituteName: data.instituteName || FALLBACK_SETTINGS.instituteName,
        instituteNameHindi: data.instituteNameHindi || data.hindiName || FALLBACK_SETTINGS.instituteNameHindi,
        phone: data.phone || FALLBACK_SETTINGS.phone,
        email: data.email || FALLBACK_SETTINGS.email,
        address: data.address || FALLBACK_SETTINGS.address,
        whatsapp: data.whatsapp || FALLBACK_SETTINGS.whatsapp,
        facebook: data.facebook || FALLBACK_SETTINGS.facebook,
        instagram: data.instagram || FALLBACK_SETTINGS.instagram,
        youtube: data.youtube || FALLBACK_SETTINGS.youtube,
        website: data.website || FALLBACK_SETTINGS.website,
        heroTitle: data.heroTitle || FALLBACK_SETTINGS.heroTitle,
        heroDescription: data.heroDescription || FALLBACK_SETTINGS.heroDescription,
        heroBadgeText: data.heroBadgeText || FALLBACK_SETTINGS.heroBadgeText,
        heroCtaPrimaryText: data.heroCtaPrimaryText || FALLBACK_SETTINGS.heroCtaPrimaryText,
        heroCtaSecondaryText: data.heroCtaSecondaryText || FALLBACK_SETTINGS.heroCtaSecondaryText,
        heroHighlightText: data.heroHighlightText !== undefined ? data.heroHighlightText : FALLBACK_SETTINGS.heroHighlightText,
        metaTitle: data.metaTitle || FALLBACK_SETTINGS.metaTitle,
        metaDescription: data.metaDescription || FALLBACK_SETTINGS.metaDescription,
        footerText: data.footerText || FALLBACK_SETTINGS.footerText,
        footerDescription: data.footerDescription || FALLBACK_SETTINGS.footerDescription,
        footerTagline: data.footerTagline || FALLBACK_SETTINGS.footerTagline,
        footerCtaText: data.footerCtaText || FALLBACK_SETTINGS.footerCtaText,
        logoUrl: data.logoUrl || FALLBACK_SETTINGS.logoUrl,
        metaKeywords: data.metaKeywords || FALLBACK_SETTINGS.metaKeywords,
        ogTitle: data.ogTitle || FALLBACK_SETTINGS.ogTitle,
        ogDescription: data.ogDescription || FALLBACK_SETTINGS.ogDescription,
        twitterTitle: data.twitterTitle || FALLBACK_SETTINGS.twitterTitle,
        twitterDescription: data.twitterDescription || FALLBACK_SETTINGS.twitterDescription,
        faviconUrl: data.faviconUrl || FALLBACK_SETTINGS.faviconUrl,
        seoImageUrl: data.seoImageUrl || FALLBACK_SETTINGS.seoImageUrl,
        googleAnalyticsId: data.googleAnalyticsId || FALLBACK_SETTINGS.googleAnalyticsId,
        googleSearchConsoleVerification: data.googleSearchConsoleVerification || FALLBACK_SETTINGS.googleSearchConsoleVerification,
      };
    }
    
    return FALLBACK_SETTINGS;
  } catch (error) {
    console.error("Firestore getWebsiteSettings failure:", error);
    return FALLBACK_SETTINGS;
  }
}
