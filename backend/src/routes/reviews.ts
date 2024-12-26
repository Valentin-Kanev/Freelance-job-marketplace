import { Router } from "express";
import { db } from "../drizzle/db";
import { and, eq } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { Profile, Review, User } from "../drizzle/schema";

const reviewsRouter = Router();

reviewsRouter.post("/:id/reviews", authenticateToken, async (req, res) => {
  const { id: freelancer_id } = req.params;
  const { client_id, rating, review_text } = req.body;

  if (!client_id || !rating || !review_text) {
    return res
      .status(400)
      .json({ message: "Client ID, rating, and review text are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const profile = await db
      .select()
      .from(Profile)
      .where(eq(Profile.user_id, freelancer_id))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    const existingReview = await db
      .select()
      .from(Review)
      .where(
        and(
          eq(Review.freelancer_id, freelancer_id),
          eq(Review.client_id, client_id)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return res.status(400).json({
        message: "You have already submitted a review for this freelancer.",
      });
    }

    await db.insert(Review).values({
      freelancer_id,
      client_id,
      rating,
      review_text,
    });

    res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    console.error("Error posting review:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error posting review", error: errorMessage });
  }
});

reviewsRouter.get("/:id/reviews", authenticateToken, async (req, res) => {
  const { id: profile_id } = req.params;

  try {
    const profile = await db
      .select()
      .from(Profile)
      .where(eq(Profile.id, profile_id))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    const user_id = profile[0].user_id;

    const reviews = await db
      .select({
        id: Review.id,
        freelancer_id: Review.freelancer_id,
        client_id: Review.client_id,
        rating: Review.rating,
        review_text: Review.review_text,
        client_username: User.username,
      })
      .from(Review)
      .innerJoin(Profile, eq(Review.client_id, Profile.user_id))
      .innerJoin(User, eq(Profile.user_id, User.id))
      .where(eq(Review.freelancer_id, user_id));

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

reviewsRouter.get("/client/:clientId", authenticateToken, async (req, res) => {
  const { clientId } = req.params;

  try {
    const reviews = await db
      .select({
        id: Review.id,
        freelancer_id: Review.freelancer_id,
        client_id: Review.client_id,
        rating: Review.rating,
        review_text: Review.review_text,
        freelancer_username: User.username,
      })
      .from(Review)
      .innerJoin(Profile, eq(Review.freelancer_id, Profile.user_id))
      .innerJoin(User, eq(Profile.user_id, User.id))
      .where(eq(Review.client_id, clientId));

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving client reviews" });
  }
});

export default reviewsRouter;
