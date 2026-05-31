import { z } from "zod";

export const categoriesList = [
  "Campus",
  "Laboratories",
  "Clinical Training",
  "Student Activities",
] as const;

export const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title cannot exceed 100 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." })
    .min(5, { message: "Description must be at least 5 characters." })
    .max(300, { message: "Description cannot exceed 300 characters." }),
  category: z
    .enum(categoriesList, {
      message: "Please select a valid gallery category.",
    }),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Gallery image is required." })
    .url({ message: "Invalid gallery image URL." }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type GallerySchemaType = z.infer<typeof gallerySchema>;
