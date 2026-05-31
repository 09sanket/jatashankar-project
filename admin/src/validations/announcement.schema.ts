import { z } from "zod";

export const announcementTypesList = [
  "Admission",
  "Event",
  "Exam",
  "Workshop",
  "Holiday",
  "Placement",
] as const;

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
  type: z
    .enum(announcementTypesList, {
      message: "Please select a valid notice type.",
    }),
  important: z
    .boolean(),
  date: z
    .string()
    .trim()
    .min(1, { message: "Date is required." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date (e.g. YYYY-MM-DD).",
    }),
});

export type AnnouncementSchemaType = z.infer<typeof announcementSchema>;
