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
        profileId: Profile.profileId,
        userId: Profile.userId,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate:
          sql`CASE WHEN ${User.userType} = 'freelancer' THEN ${Profile.hourlyRate} ELSE NULL END`.as(
            "hourlyRate"
          ),
        username: User.username,
        userType: User.userType,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.userId, User.userId))
      .where(eq(User.userType, "freelancer"));

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

router.get("/profiles/user/:userId", async (req, res) => {
  const { userId: userId } = req.params;

  try {
    const profile = await db
      .select({
        profileId: Profile.profileId,
        userId: Profile.userId,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate:
          sql`CASE WHEN ${User.userType} = 'freelancer' THEN ${Profile.hourlyRate} ELSE NULL END`.as(
            "hourlyRate"
          ),
        username: User.username,
        userType: User.userType,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.userId, User.userId))
      .where(eq(Profile.userId, userId));

    const username = profile[0]?.username;
    req.logger.info({ userId, username }, "Profile retrieved for user");
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
    const { skills, description, hourlyRate } = req.body;
    const { id: userId } = req.user as JwtPayload;

    try {
      const newProfile = await db
        .insert(Profile)
        .values({
          userId,
          skills,
          description,
          hourlyRate: sql`${hourlyRate}`,
        })
        .returning({
          id: Profile.profileId,
          userId: Profile.userId,
          skills: Profile.skills,
          description: Profile.description,
          hourlyRate: Profile.hourlyRate,
        });

      const profileData = newProfile[0]
        ? {
            ...newProfile[0],
            hourlyRate:
              newProfile[0].hourlyRate !== null
                ? Number(newProfile[0].hourlyRate)
                : null,
          }
        : undefined;

      res
        .status(201)
        .json({ message: "Profile created successfully", data: profileData });
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
    const { skills, description, hourlyRate } = req.body;
    const userId = req.user.id;

    try {
      const profile = await db.query.Profile.findFirst({
        where: eq(Profile.profileId, id),
      });

      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }

      if (profile.userId !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this profile" });
        return;
      }

      const user = await db.query.User.findFirst({
        where: eq(User.userId, userId),
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isFreelancer = user.userType === "freelancer";
      const updateData: any = {
        skills,
        description,
        hourlyRate:
          isFreelancer && hourlyRate !== undefined ? sql`${hourlyRate}` : null,
      };

      const updatedProfile = await db
        .update(Profile)
        .set(updateData)
        .where(eq(Profile.profileId, id));

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
        profileId: Profile.profileId,
        userId: Profile.userId,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate: Profile.hourlyRate,
        username: User.username,
        userType: User.userType,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.userId, User.userId))
      .where(
        and(
          eq(User.userType, "freelancer"),
          or(ilike(User.username, `%${query}%`))
        )
      );

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to search profiles" });
  }
});

export default router;
