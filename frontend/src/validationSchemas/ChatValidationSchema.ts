import { z } from "zod";

export const createMessageSchema = z.object({
  content: z
    .string()
    .max(200, "Message content is too long. Must be less than 200 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Message content cannot be empty",
    }),
});

export type CreateMessageValidation = z.infer<typeof createMessageSchema>;
