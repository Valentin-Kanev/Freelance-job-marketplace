import { Review, Profile } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { Router } from "express";
import { eq } from "drizzle-orm";

const reviewsRouter = Router();

reviewsRouter.post("/profiles/:id/reviews", async (req, res) => {
  const { id: freelancer_id } = req.params; // Freelancer (Profile) ID from the URL
  const { client_id, rating, review_text } = req.body; // Client ID, rating, and review text from the request body

  if (!client_id || !rating || !review_text) {
    return res
      .status(400)
      .json({ message: "Client ID, rating, and review text are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    // Check if the freelancer exists (you might also want to check if the user is a freelancer)
    const profile = await db
      .select()
      .from(Profile)
      .where(eq(Profile.id, freelancer_id))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // Use the user_id from the profile table to post the review
    await db.insert(Review).values({
      freelancer_id: profile[0].user_id, // Make sure to use the user_id
      client_id,
      rating,
      review_text,
    });

    res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error posting review" });
  }
});

reviewsRouter.get("/profiles/:id/reviews", async (req, res) => {
  const { id: freelancer_id } = req.params; // Freelancer (Profile) ID from the URL

  try {
    // Fetch all reviews for the freelancer
    const reviews = await db
      .select()
      .from(Review)
      .where(eq(Review.freelancer_id, freelancer_id));

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this freelancer" });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

export default reviewsRouter;
