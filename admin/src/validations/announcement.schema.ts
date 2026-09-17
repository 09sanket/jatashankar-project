import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .min(5, { message: "Title must be at least 5 characters." })
    .max(150, { message: "Title cannot exceed 150 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." })
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Invalid image URL.",
    }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type AnnouncementSchemaType = z.infer<typeof announcementSchema>;
