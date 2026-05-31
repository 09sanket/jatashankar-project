import { z } from "zod";

export const departmentsList = [
  "Physiotherapy",
  "Medical Lab Technology",
  "Radiology",
  "Anatomy",
  "Community Medicine",
  "Operation Theatre Technology",
] as const;

export const facultySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Faculty member name is required." })
    .min(3, { message: "Faculty name must be at least 3 characters." })
    .max(80, { message: "Faculty name cannot exceed 80 characters." }),
  designation: z
    .string()
    .trim()
    .min(1, { message: "Designation is required." })
    .min(2, { message: "Designation must be at least 2 characters." })
    .max(80, { message: "Designation cannot exceed 80 characters." }),
  department: z
    .enum(departmentsList, {
      message: "Please select a valid department.",
    }),
  experience: z
    .string()
    .trim()
    .min(1, { message: "Experience is required." })
    .min(2, { message: "Experience must be at least 2 characters (e.g., '5+ Years')." })
    .max(30, { message: "Experience cannot exceed 30 characters." }),
  specialization: z
    .string()
    .trim()
    .min(1, { message: "Specialization is required." })
    .min(3, { message: "Specialization must be at least 3 characters (e.g., 'Orthopedics')." })
    .max(150, { message: "Specialization cannot exceed 150 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description (biography) is required." })
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description cannot exceed 500 characters." }),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Faculty profile image is required." })
    .url({ message: "Invalid profile image URL." }),
  publicId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type FacultySchemaType = z.infer<typeof facultySchema>;
