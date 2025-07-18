import { z } from "zod";

export const createApplicationSchema = z.object({
  cover_letter: z
    .string()
    .min(20, "Cover letter is required and must be at least 20 characters")
    .max(500, "Cover letter is too long. The maximum length is 500 characters"),
});

export type CreateApplicationValidation = z.infer<
  typeof createApplicationSchema
>;
