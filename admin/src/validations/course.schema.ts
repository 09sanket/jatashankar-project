import { z } from "zod";

export const courseSchema = z.object({
  courseName: z
    .string()
    .trim()
    .min(1, { message: "Course name is required." })
    .min(3, { message: "Course name must be at least 3 characters." })
    .max(100, { message: "Course name cannot exceed 100 characters." }),
  shortName: z
    .string()
    .trim()
    .min(1, { message: "Short name is required." })
    .min(2, { message: "Short name must be at least 2 characters." })
    .max(20, { message: "Short name cannot exceed 20 characters." }),
  duration: z
    .string()
    .trim()
    .min(1, { message: "Please select course duration." }),
  eligibility: z
    .string()
    .trim()
    .min(1, { message: "Eligibility criteria is required." })
    .min(5, { message: "Eligibility criteria must be at least 5 characters." })
    .max(200, { message: "Eligibility criteria cannot exceed 200 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." })
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),
  careerScope: z
    .string()
    .trim()
    .min(1, { message: "Career scope is required." })
    .min(10, { message: "Career scope must be at least 10 characters." })
    .max(1000, { message: "Career scope cannot exceed 1000 characters." }),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Course cover image is required." })
    .url({ message: "Invalid cover image URL." }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  featured: z
    .boolean(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
