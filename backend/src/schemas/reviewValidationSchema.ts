import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  review_text: z
    .string()
    .min(5, "Review text is required")
    .min(200, "Review text must be at least 200 characters"),
});

export type CreateReviewValidation = z.infer<typeof createReviewSchema>;
