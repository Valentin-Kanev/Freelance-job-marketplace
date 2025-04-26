import authenticateToken from "../middleware/Authentication/authenticateToken";
import { Application, Job, User } from "../drizzle/schema";
import { Router, Response } from "express";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  createApplicationSchema,
  CreateApplicationValidation,
} from "../schemas/applicationValidationSchema";
import { validate } from "../middleware/validate";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { logger } from "../middleware/logger";
import { CustomResponse } from "../types/responseType";

const applicationsRouter = Router();

applicationsRouter.post(
  "/jobs/:id/apply",
  validate(createApplicationSchema),
  authenticateToken,
  async (
    req: AuthenticatedRequest<CreateApplicationValidation>,
    res: Response<CustomResponse<CreateApplicationValidation>>
  ) => {
    const job_id = Number(req.params.id);
    const { cover_letter } = req.body;
    const freelancer_id = req.user.user_id;

    if (!job_id || !freelancer_id) {
      logger.error("Missing job_id or freelancer_id", {
        job_id,
        freelancer_id,
      });
      return res
        .status(400)
        .json({ message: "Invalid job ID or freelancer ID" });
    }

    try {
      const existingApplication = await db.query.Application.findFirst({
        where: and(
          eq(Application.job_id, job_id),
          eq(Application.freelancer_id, freelancer_id)
        ),
      });

      if (existingApplication) {
        logger.warn("User has already applied for this job:", {
          job_id,
          freelancer_id,
        });
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
      logger.error("Error applying for job:", error);
      res.status(500).json({
        message: "Error applying for the job",
        error: (error as Error).message,
      });
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
          id: Application.application_id,
          cover_letter: Application.cover_letter,
          freelancer_id: Application.freelancer_id,
          username: User.username,
        })
        .from(Application)
        .innerJoin(User, eq(Application.freelancer_id, User.user_id))
        .where(
          and(eq(Application.job_id, job_id), isNull(Application.deleted_at))
        );

      res.json(applications);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error retrieving applications" });
    }
  }
);

applicationsRouter.get(
  "/applications/my-applications",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const freelancerId = req.user.user_id;

    try {
      const applications = await db
        .select({
          job_id: Application.job_id,
          jobTitle: Job.title,
          coverLetter: Application.cover_letter,
          applicationDate: Application.timestamp,
        })
        .from(Application)
        .innerJoin(Job, eq(Application.job_id, Job.job_id))
        .where(
          and(
            eq(Application.freelancer_id, freelancerId),
            isNull(Application.deleted_at)
          )
        );

      res.json(applications);
    } catch (error) {
      logger.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  }
);

export default applicationsRouter;
