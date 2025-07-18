import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { and, eq } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { Profile, Review, User } from "../drizzle/schema";
import { validate } from "../middleware/validate";
import {
  createReviewSchema,
  CreateReviewValidation,
} from "../schemas/reviewValidationSchema";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { CustomResponse } from "../types/responseTypes";

const reviewsRouter = Router();

reviewsRouter.post(
  "/:id/reviews",
  authenticateToken,
  validate(createReviewSchema),
  async (
    req: AuthenticatedRequest<CreateReviewValidation>,
    res: Response<CustomResponse<CreateReviewValidation>>
  ) => {
    const { id: freelancer_id } = req.params;
    const { rating, review_text } = req.body;
    const { id: client_id } = req.user;

    try {
      const existingReview = await db.query.Review.findFirst({
        where: and(
          eq(Review.freelancer_id, freelancer_id),
          eq(Review.client_id, client_id)
        ),
      });

      if (existingReview) {
        res.status(400).json({
          message: "You have already submitted a review for this freelancer.",
        });
        return;
      }

      await db
        .insert(Review)
        .values({ freelancer_id, client_id, rating, review_text });

      res.status(201).json({ message: "Review posted successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Error posting review", error: errorMessage });
    }
  }
);

reviewsRouter.get(
  "/:id/reviews",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id: profile_id } = req.params;

    try {
      const profile = await db.query.Profile.findFirst({
        where: eq(Profile.profile_id, profile_id),
      });

      if (!profile) {
        res.status(404).json({ message: "Freelancer profile not found" });
        return;
      }

      const user_id = profile.user_id;

      const reviews = await db
        .select({
          id: Review.review_id,
          freelancer_id: Review.freelancer_id,
          client_id: Review.client_id,
          rating: Review.rating,
          review_text: Review.review_text,
          client_username: User.username,
        })
        .from(Review)
        .innerJoin(Profile, eq(Review.client_id, Profile.user_id))
        .innerJoin(User, eq(Profile.user_id, User.user_id))
        .where(eq(Review.freelancer_id, user_id));

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving reviews" });
    }
  }
);

reviewsRouter.get(
  "/client/:clientId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { clientId } = req.params;

    try {
      const reviews = await db
        .select({
          id: Review.review_id,
          freelancer_id: Review.freelancer_id,
          client_id: Review.client_id,
          rating: Review.rating,
          review_text: Review.review_text,
          freelancer_username: User.username,
        })
        .from(Review)
        .innerJoin(Profile, eq(Review.freelancer_id, Profile.user_id))
        .innerJoin(User, eq(Profile.user_id, User.user_id))
        .where(eq(Review.client_id, clientId));

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving client reviews" });
    }
  }
);

export default reviewsRouter;
