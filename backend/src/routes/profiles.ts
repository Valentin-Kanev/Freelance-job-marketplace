import { Request, Response, Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { Profile, User } from "../drizzle/schema";
import authenticateToken from "../middleware/Authentication/authenticateToken";

const router = Router();

router.get("/profiles", async (req: Request, res: Response) => {
  try {
    const profiles = await db
      .select({
        profileId: Profile.id,
        userId: Profile.user_id,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate: Profile.hourly_rate,
        username: User.username,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.user_id, User.id))
      .where(eq(User.user_type, "freelancer"));

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve profiles" });
  }
});

router.get("/profiles/user/:user_id", authenticateToken, async (req, res) => {
  const { user_id: userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const profile = await db
      .select({
        profileId: Profile.id,
        userId: Profile.user_id,
        skills: Profile.skills,
        description: Profile.description,
        hourlyRate: Profile.hourly_rate,
        username: User.username,
      })
      .from(Profile)
      .leftJoin(User, eq(Profile.user_id, User.id))
      .where(eq(Profile.user_id, userId));

    if (profile.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/profiles",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { user_id, skills, description, hourly_rate } = req.body;

    try {
      const newProfile = await db
        .insert(Profile)
        .values({
          user_id,
          skills,
          description,
          hourly_rate,
        })
        .returning({
          id: Profile.id,
          userId: Profile.user_id,
          skills: Profile.skills,
          description: Profile.description,
          hourlyRate: Profile.hourly_rate,
        });

      res.status(201).json(newProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to create profile" });
    }
  }
);

router.put(
  "/profiles/user/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { skills, description, hourly_rate } = req.body;

    try {
      const updatedProfile = await db
        .update(Profile)
        .set({
          skills,
          description,
          hourly_rate,
        })
        .where(eq(Profile.id, id))
        .returning({
          id: Profile.id,
          userId: Profile.user_id,
          skills: Profile.skills,
          description: Profile.description,
          hourlyRate: Profile.hourly_rate,
        });

      if (updatedProfile.length === 0) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

export default router;
