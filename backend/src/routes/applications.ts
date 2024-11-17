import { Application, Job, User } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedUser extends JwtPayload {
  id: string;
}

const applicationsRouter = Router();

// Type guard to ensure `req.user` has an `id`
function isAuthenticatedUser(
  user: JwtPayload | string | undefined
): user is AuthenticatedUser {
  return !!user && typeof user !== "string" && "id" in user;
}

// POST route to apply for a job
applicationsRouter.post(
  "/jobs/:id/apply",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id: job_id } = req.params;
    const { freelancer_id, cover_letter } = req.body;

    if (!req.file || !freelancer_id || !cover_letter) {
      return res.status(400).json({
        message: "Freelancer ID, cover letter, and file are required",
      });
    }

    try {
      // Save only the relative path
      const filePath = `/uploads/${req.file.filename}`;

      await db.insert(Application).values({
        job_id,
        freelancer_id,
        cover_letter,
        timestamp: new Date(),
      });

      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error inserting application:", error);
      res.status(500).json({ message: "Error applying for the job" });
    }
  }
);

// GET route to fetch all applications for a job (only accessible by the job creator)
applicationsRouter.get(
  "/jobs/:id/applications",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id: job_id } = req.params;

    // Type assertion for `req.user` after the type guard check
    if (!isAuthenticatedUser(req.user)) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user.id;

    try {
      // Verify that the job was created by the authenticated user
      const job = await db
        .select()
        .from(Job)
        .where(eq(Job.id, job_id))
        .limit(1);
      if (!job || job[0].client_id !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to view applications" });
      }

      // Retrieve all applications for the job
      const applications = await db
        .select({
          id: Application.id,
          cover_letter: Application.cover_letter,
          freelancer_id: Application.freelancer_id,
          username: User.username, // Select username from the User table
        })
        .from(Application)
        .innerJoin(User, eq(Application.freelancer_id, User.id))
        .where(eq(Application.job_id, job_id));

      res.json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving applications" });
    }
  }
);

export default applicationsRouter;
