import { z } from "zod";

export const settingsSchema = z.object({
  instituteName: z
    .string()
    .trim()
    .min(1, { message: "Institute name is required." })
    .min(3, { message: "Institute name must be at least 3 characters." })
    .max(150, { message: "Institute name cannot exceed 150 characters." }),
  hindiName: z
    .string()
    .trim()
    .min(1, { message: "Hindi name is required." })
    .min(3, { message: "Hindi name must be at least 3 characters." })
    .max(150, { message: "Hindi name cannot exceed 150 characters." }),
  address: z
    .string()
    .trim()
    .min(1, { message: "Address is required." })
    .min(5, { message: "Address must be at least 5 characters." })
    .max(300, { message: "Address cannot exceed 300 characters." }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." })
    .min(10, { message: "Phone number must be at least 10 characters." })
    .max(20, { message: "Phone number cannot exceed 20 characters." }),
  whatsapp: z
    .string()
    .trim()
    .min(1, { message: "WhatsApp number is required." })
    .min(10, { message: "WhatsApp number must be at least 10 characters." })
    .max(20, { message: "WhatsApp number cannot exceed 20 characters." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  facebook: z
    .string()
    .trim()
    .url({ message: "Please enter a valid Facebook URL (e.g. https://facebook.com/...)." })
    .or(z.literal("")),
  instagram: z
    .string()
    .trim()
    .url({ message: "Please enter a valid Instagram URL (e.g. https://instagram.com/...)." })
    .or(z.literal("")),
  youtube: z
    .string()
    .trim()
    .url({ message: "Please enter a valid YouTube URL (e.g. https://youtube.com/...)." })
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url({ message: "Please enter a valid website URL (e.g. https://example.com)." })
    .or(z.literal("")),
  heroTitle: z
    .string()
    .trim()
    .min(1, { message: "Hero title is required." })
    .min(5, { message: "Hero title must be at least 5 characters." })
    .max(200, { message: "Hero title cannot exceed 200 characters." }),
  heroDescription: z
    .string()
    .trim()
    .min(1, { message: "Hero description is required." })
    .min(10, { message: "Hero description must be at least 10 characters." })
    .max(800, { message: "Hero description cannot exceed 800 characters." }),
  heroBadgeText: z
    .string()
    .trim()
    .min(1, { message: "Hero badge text is required." })
    .min(3, { message: "Hero badge text must be at least 3 characters." })
    .max(100, { message: "Hero badge text cannot exceed 100 characters." }),
  heroCtaPrimaryText: z
    .string()
    .trim()
    .min(1, { message: "Primary CTA button text is required." })
    .min(2, { message: "Primary CTA button text must be at least 2 characters." })
    .max(50, { message: "Primary CTA button text cannot exceed 50 characters." }),
  heroCtaSecondaryText: z
    .string()
    .trim()
    .min(1, { message: "Secondary CTA button text is required." })
    .min(2, { message: "Secondary CTA button text must be at least 2 characters." })
    .max(50, { message: "Secondary CTA button text cannot exceed 50 characters." }),
  heroHighlightText: z
    .string()
    .trim()
    .max(100, { message: "Hero highlight text cannot exceed 100 characters." })
    .optional()
    .or(z.literal("")),
  metaTitle: z
    .string()
    .trim()
    .min(1, { message: "Meta title is required." })
    .min(5, { message: "Meta title must be at least 5 characters." })
    .max(150, { message: "Meta title cannot exceed 150 characters." }),
  metaDescription: z
    .string()
    .trim()
    .min(1, { message: "Meta description is required." })
    .min(10, { message: "Meta description must be at least 10 characters." })
    .max(300, { message: "Meta description cannot exceed 300 characters." }),
  footerText: z
    .string()
    .trim()
    .min(1, { message: "Footer text is required." })
    .min(3, { message: "Footer text must be at least 3 characters." })
    .max(300, { message: "Footer text cannot exceed 300 characters." }),
  footerDescription: z
    .string()
    .trim()
    .min(1, { message: "Footer description is required." })
    .min(5, { message: "Footer description must be at least 5 characters." })
    .max(500, { message: "Footer description cannot exceed 500 characters." }),
  footerTagline: z
    .string()
    .trim()
    .min(1, { message: "Footer tagline is required." })
    .min(3, { message: "Footer tagline must be at least 3 characters." })
    .max(150, { message: "Footer tagline cannot exceed 150 characters." }),
  footerCtaText: z
    .string()
    .trim()
    .min(1, { message: "Footer CTA text is required." })
    .min(2, { message: "Footer CTA text must be at least 2 characters." })
    .max(100, { message: "Footer CTA text cannot exceed 100 characters." }),
  logoUrl: z
    .string()
    .trim()
    .min(1, { message: "Website logo image is required." })
    .url({ message: "Invalid logo image URL." }),
  logoPublicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  metaKeywords: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  ogTitle: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  ogDescription: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  twitterTitle: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  twitterDescription: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  faviconUrl: z
    .string()
    .trim()
    .url({ message: "Invalid favicon URL." })
    .optional()
    .or(z.literal("")),
  seoImageUrl: z
    .string()
    .trim()
    .url({ message: "Invalid SEO Image URL." })
    .optional()
    .or(z.literal("")),
  googleAnalyticsId: z
    .string()
    .trim()
    .regex(/^G-[A-Z0-9]+$/, { message: "Google Analytics Measurement ID must start with 'G-' followed by uppercase alphanumeric characters (e.g., G-XXXXXXXXXX)." })
    .or(z.literal(""))
    .optional(),
  googleSearchConsoleVerification: z
    .string()
    .trim()
    .max(200, { message: "Verification code cannot exceed 200 characters." })
    .or(z.literal(""))
    .optional(),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;
