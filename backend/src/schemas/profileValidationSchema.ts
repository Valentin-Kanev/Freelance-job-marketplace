import { z } from "zod";

export const createProfileSchema = z.object({
  skills: z
    .string()
    .min(4, "Skills are required")
    .max(100, "Skills are too long. They must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long. It must be less than 500 characters"),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
});
export type CreateProfileValidation = z.infer<typeof createProfileSchema>;

export const updateProfileSchema = createProfileSchema.partial();
export type UpdateProfileValidation = z.infer<typeof updateProfileSchema>;
