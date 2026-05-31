import { z } from "zod";

export const coursesList = [
  "BPT",
  "BMLT",
  "DMLT",
  "BXRT",
  "OT Technician",
] as const;

export const testimonialSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(1, { message: "Student name is required." })
    .min(3, { message: "Student name must be at least 3 characters." })
    .max(80, { message: "Student name cannot exceed 80 characters." }),
  review: z
    .string()
    .trim()
    .min(1, { message: "Review text is required." })
    .min(10, { message: "Review must be at least 10 characters." })
    .max(500, { message: "Review cannot exceed 500 characters." }),
  rating: z
    .number({ message: "Rating must be a number." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." }),
  course: z
    .enum(coursesList, {
      message: "Please select a valid course.",
    }),
  designation: z
    .string()
    .trim()
    .min(1, { message: "Designation/Role is required." })
    .min(3, { message: "Designation/Role must be at least 3 characters (e.g. 'Student')." })
    .max(80, { message: "Designation cannot exceed 80 characters." }),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Student image is required." })
    .url({ message: "Invalid student image URL." }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  featured: z
    .boolean(),
});

export type TestimonialSchemaType = z.infer<typeof testimonialSchema>;
