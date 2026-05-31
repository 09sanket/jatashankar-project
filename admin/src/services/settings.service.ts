import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface WebsiteSettings {
  instituteName: string;
  hindiName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
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
  logoPublicId: string;
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

/**
 * Fetches the global website settings document from Firestore.
 *
 * @returns A promise resolving to the WebsiteSettings object or null if it does not exist.
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as WebsiteSettings;
    }
    return null;
  } catch (error) {
    console.error("Firestore getWebsiteSettings failure:", error);
    throw error;
  }
}

/**
 * Updates or sets the global website settings document in Firestore.
 *
 * @param data The settings fields to save
 * @returns A promise resolving when the update is complete
 */
export async function updateWebsiteSettings(data: WebsiteSettings): Promise<void> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Firestore updateWebsiteSettings failure:", error);
    throw error;
  }
}
