import { z } from "zod";

export const guideSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Guide name is required." })
    .min(3, { message: "Name must be at least 3 characters." })
    .max(80, { message: "Name cannot exceed 80 characters." }),
  designation: z
    .string()
    .trim()
    .min(1, { message: "Designation is required." })
    .min(2, { message: "Designation must be at least 2 characters." })
    .max(80, { message: "Designation cannot exceed 80 characters." }),
  description: z
    .string()
    .trim()
    .max(200, { message: "Description should be short (around 2 lines, max 200 chars)." })
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Profile image is required." })
    .url({ message: "Invalid profile image URL." }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type GuideSchemaType = z.infer<typeof guideSchema>;
