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
    const { id: freelancerId } = req.params;
    const { rating, reviewText } = req.body;
    const { id: clientId } = req.user;

    try {
      const existingReview = await db.query.Review.findFirst({
        where: and(
          eq(Review.freelancerId, freelancerId),
          eq(Review.clientId, clientId)
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
        .values({ freelancerId, clientId, rating, reviewText });

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
    const { id: profileId } = req.params;

    try {
      const profile = await db.query.Profile.findFirst({
        where: eq(Profile.profileId, profileId),
      });

      if (!profile) {
        res.status(404).json({ message: "Freelancer profile not found" });
        return;
      }

      const userId = profile.userId;

      const reviews = await db
        .select({
          id: Review.reviewId,
          freelancerId: Review.freelancerId,
          clientId: Review.clientId,
          rating: Review.rating,
          reviewText: Review.reviewText,
          clientUsername: User.username,
        })
        .from(Review)
        .innerJoin(Profile, eq(Review.clientId, Profile.userId))
        .innerJoin(User, eq(Profile.userId, User.userId))
        .where(eq(Review.freelancerId, userId));

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
          id: Review.reviewId,
          freelancerId: Review.freelancerId,
          clientId: Review.clientId,
          rating: Review.rating,
          reviewText: Review.reviewText,
          freelancerUsername: User.username,
        })
        .from(Review)
        .innerJoin(Profile, eq(Review.freelancerId, Profile.userId))
        .innerJoin(User, eq(Profile.userId, User.userId))
        .where(eq(Review.clientId, clientId));

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving client reviews" });
    }
  }
);

export default reviewsRouter;
