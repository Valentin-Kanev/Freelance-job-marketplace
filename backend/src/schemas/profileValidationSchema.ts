import { z } from "zod";

export const createProfileSchema = z.object({
  skills: z
    .string()
    .min(4, "Skills are required to be at least 4 characters")
    .max(100, "Skills are too long. They must be less than 200 characters"),
  description: z
    .string()
    .min(20, "Description is required to be at least 20 characters")
    .max(500, "Description is too long. It must be less than 500 characters"),
  hourly_rate: z
    .number()
    .positive("Hourly rate must be a positive number")
    .nullable(),
});
export type CreateProfileValidation = z.infer<typeof createProfileSchema>;

export const updateProfileSchema = createProfileSchema.partial();
export type UpdateProfileValidation = z.infer<typeof updateProfileSchema>;
