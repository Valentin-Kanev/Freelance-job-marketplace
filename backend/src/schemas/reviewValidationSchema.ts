import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  review_text: z
    .string()
    .min(20, "Review text must be at least 20 characters")
    .max(500, "Review text must be at most 500 characters"),
});

export type CreateReviewValidation = z.infer<typeof createReviewSchema>;
