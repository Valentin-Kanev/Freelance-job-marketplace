import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(80, "Title is too long. It must be less than 80 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1500, "Description is too long. It must be less than 1500 characters"),
  budget: z.string().min(1, "Budget is required"),
  deadline: z.preprocess(
    (date) => (typeof date === "string" ? new Date(date) : date),
    z.date({
      required_error: "Deadline is required",
      invalid_type_error: "Invalid date format for deadline",
    })
  ),
});

export const jobUpdateSchema = jobSchema.partial();
export const jobSearchSchema = z.object({
  title: z.string().min(1, "Title query parameter is required"),
});

export type CreateJobValidation = z.infer<typeof jobSchema>;
export type UpdateJobValidation = z.infer<typeof jobUpdateSchema>;
export type SearchJobValidation = z.infer<typeof jobSearchSchema>;
