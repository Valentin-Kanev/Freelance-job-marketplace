import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(80, "Title is too long. It must be less than 80 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1500, "Description is too long. It must be less than 1500 characters"),
  budget: z
    .number()
    .positive("Budget must be a positive number")
    .refine((val) => typeof val === "number", "Budget must be a number"),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
});
export type CreateJobValidation = z.infer<typeof createJobSchema>;

export const updateJobSchema = createJobSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided to update",
  });
export type UpdateJobValidation = z.infer<typeof updateJobSchema>;

export const jobSearchSchema = z.object({
  title: z.string().min(1, "Title query parameter is required"),
});
export type SearchJobValidation = z.infer<typeof jobSearchSchema>;
