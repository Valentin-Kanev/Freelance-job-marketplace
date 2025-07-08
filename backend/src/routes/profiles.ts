import { Request, Response, Router } from "express";
import { eq, and, or, sql, ilike } from "drizzle-orm";
import { db } from "../drizzle/db";
import { Profile, User } from "../drizzle/schema";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { validate } from "../middleware/validate";
import {
  createProfileSchema,
  CreateProfileValidation,
  updateProfileSchema,
  UpdateProfileValidation,
} from "../schemas/profileValidationSchema";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { JwtPayload } from "jsonwebtoken";
import { CustomResponse } from "../types/responseTypes";

const router = Router();

router.get("/profiles", async (req, res) => {
  try {
    const profiles = await db
      .select({
        profileId: Profile.profile_id,
        userId: Profile.user_id,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate:
          sql`CASE WHEN ${User.user_type} = 'freelancer' THEN ${Profile.hourly_rate} ELSE NULL END`.as(
            "hourlyRate"
          ),
        username: User.username,
        userType: User.user_type,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.user_id, User.user_id))
      .where(eq(User.user_type, "freelancer"));

    req.logger.info(
      { count: profiles.length },
      "Profiles retrieved successfully"
    );
    res.status(200).json(profiles);
  } catch (error) {
    req.logger.error({ error }, "Failed to retrieve profiles");
    res.status(500).json({ error: "Failed to retrieve profiles" });
  }
});

router.get("/profiles/user/:user_id", async (req, res) => {
  const { user_id: userId } = req.params;

  try {
    const profile = await db
      .select({
        profileId: Profile.profile_id,
        userId: Profile.user_id,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate:
          sql`CASE WHEN ${User.user_type} = 'freelancer' THEN ${Profile.hourly_rate} ELSE NULL END`.as(
            "hourlyRate"
          ),
        username: User.username,
        userType: User.user_type,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.user_id, User.user_id))
      .where(eq(Profile.user_id, userId));

    req.logger.info({ userId }, "Profile retrieved for user");
    res.status(200).json(profile[0]);
  } catch (error) {
    req.logger.error({ error, userId }, "Failed to retrieve user profile");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/profiles",
  authenticateToken,
  validate(createProfileSchema),
  async (
    req: AuthenticatedRequest<CreateProfileValidation>,
    res: Response<CustomResponse<UpdateProfileValidation>>
  ) => {
    const { skills, description, hourly_rate } = req.body;
    const { id: user_id } = req.user as JwtPayload;

    try {
      const newProfile = await db
        .insert(Profile)
        .values({
          user_id,
          skills,
          description,
          hourly_rate: sql`${hourly_rate}`,
        })
        .returning({
          id: Profile.profile_id,
          userId: Profile.user_id,
          skills: Profile.skills,
          description: Profile.description,
          hourlyRate: Profile.hourly_rate,
        });

      res
        .status(201)
        .json({ message: "Profile created successfully", data: newProfile[0] });
    } catch (error) {
      res.status(500).json({ error: "Failed to create profile" });
    }
  }
);

router.put(
  "/profiles/user/:id",
  authenticateToken,
  validate(updateProfileSchema),
  async (
    req: AuthenticatedRequest<UpdateProfileValidation>,
    res: Response<CustomResponse<UpdateProfileValidation>>
  ) => {
    const { id } = req.params;
    const { skills, description, hourly_rate } = req.body;
    const userId = req.user.id;

    try {
      const profile = await db.query.Profile.findFirst({
        where: eq(Profile.profile_id, id),
      });

      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }

      if (profile.user_id !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this profile" });
        return;
      }

      const user = await db.query.User.findFirst({
        where: eq(User.user_id, userId),
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isFreelancer = user.user_type === "freelancer";
      const updateData: any = {
        skills,
        description,
        hourly_rate:
          isFreelancer && hourly_rate !== undefined
            ? sql`${hourly_rate}`
            : null,
      };

      const updatedProfile = await db
        .update(Profile)
        .set(updateData)
        .where(eq(Profile.profile_id, id));

      res.status(200).json({
        message: "Profile updated successfully",
        data: updatedProfile[0],
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

router.get("/profiles/search", async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const profiles = await db
      .select({
        profileId: Profile.profile_id,
        userId: Profile.user_id,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate: Profile.hourly_rate,
        username: User.username,
        userType: User.user_type,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.user_id, User.user_id))
      .where(
        and(
          eq(User.user_type, "freelancer"),
          or(ilike(User.username, `%${query}%`))
        )
      );

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to search profiles" });
  }
});

export default router;
