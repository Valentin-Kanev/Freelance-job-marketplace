import authenticateToken from "../middleware/Authentication/authenticateToken";
import { Application, Job, User } from "../drizzle/schema";
import { Router, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  createApplicationSchema,
  CreateApplicationValidation,
} from "../schemas/applicationValidationSchema";
import { validate } from "../middleware/validate";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { JwtPayload } from "jsonwebtoken";

const applicationsRouter = Router();

applicationsRouter.post(
  "/jobs/:id/apply",
  validate(createApplicationSchema),
  authenticateToken,
  async (
    req: AuthenticatedRequest<CreateApplicationValidation>,
    res: Response
  ) => {
    const { job_id } = req.params;
    const { cover_letter } = req.body;
    const { freelancer_id } = req.user as JwtPayload;

    try {
      const existingApplication = await db.query.Application.findFirst({
        where: and(
          eq(Application.job_id, job_id),
          eq(Application.freelancer_id, freelancer_id)
        ),
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this job" });
      }

      await db.transaction(async (trx) => {
        await trx.insert(Application).values({
          job_id,
          freelancer_id,
          cover_letter,
          timestamp: new Date(),
        });
      });

      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error applying for the job:", error);
      res.status(500).json({ message: "Error applying for the job", error });
    }
  }
);

applicationsRouter.get(
  "/jobs/:id/applications",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: job_id } = req.params;

    try {
      const applications = await db
        .select({
          id: Application.id,
          cover_letter: Application.cover_letter,
          freelancer_id: Application.freelancer_id,
          username: User.username,
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

applicationsRouter.get(
  "/applications/my-applications",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const freelancerId = req.user.id;

    try {
      const applications = await db
        .select({
          jobId: Application.job_id,
          jobTitle: Job.title,
          coverLetter: Application.cover_letter,
          applicationDate: Application.timestamp,
        })
        .from(Application)
        .innerJoin(Job, eq(Application.job_id, Job.id))
        .where(eq(Application.freelancer_id, freelancerId));

      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  }
);

export default applicationsRouter;
