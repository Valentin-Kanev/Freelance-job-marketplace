import authenticateToken from "../middleware/Authentication/authenticateToken";
import { Application, Job, User } from "../drizzle/schema";
import { Router, Response } from "express";
import { and, eq, isNull, desc } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  createApplicationSchema,
  CreateApplicationValidation,
} from "../schemas/applicationValidationSchema";
import { validate } from "../middleware/validate";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { logger } from "../middleware/logger";
import { CustomResponse } from "../types/responseTypes";

const applicationsRouter = Router();

applicationsRouter.post(
  "/jobs/:id/apply",
  validate(createApplicationSchema),
  authenticateToken,
  async (
    req: AuthenticatedRequest<CreateApplicationValidation>,
    res: Response<CustomResponse<CreateApplicationValidation>>
  ) => {
    const jobId = Number(req.params.id);
    const { coverLetter } = req.body;
    const freelancerId = req.user.userId;

    if (!jobId || !freelancerId) {
      logger.error("Missing jobId or freelancerId", {
        jobId,
        freelancerId,
      });
      res.status(400).json({ message: "Invalid job ID or freelancer ID" });
      return;
    }

    try {
      const existingApplication = await db.query.Application.findFirst({
        where: and(
          eq(Application.jobId, jobId),
          eq(Application.freelancerId, freelancerId)
        ),
      });

      if (existingApplication) {
        logger.warn("User has already applied for this job:", {
          jobId,
          freelancerId,
        });
        res
          .status(400)
          .json({ message: "You have already applied for this job" });
        return;
      }

      await db.transaction(async (trx) => {
        await trx.insert(Application).values({
          jobId,
          freelancerId,
          coverLetter,
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
    const { id: jobId } = req.params;

    try {
      const applications = await db
        .select({
          applicationId: Application.applicationId,
          jobId: Application.jobId,
          coverLetter: Application.coverLetter,
          freelancerId: Application.freelancerId,
          username: User.username,
        })
        .from(Application)
        .innerJoin(User, eq(Application.freelancerId, User.userId))
        .where(
          and(eq(Application.jobId, jobId), isNull(Application.deletedAt))
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
    const freelancerId = req.user.userId;

    try {
      const applications = await db
        .select({
          jobId: Application.jobId,
          jobTitle: Job.title,
          coverLetter: Application.coverLetter,
          applicationDate: Application.timestamp,
        })
        .from(Application)
        .innerJoin(Job, eq(Application.jobId, Job.jobId))
        .where(
          and(
            eq(Application.freelancerId, freelancerId),
            isNull(Application.deletedAt)
          )
        )
        .orderBy(desc(Application.timestamp));

      res.json(applications);
    } catch (error) {
      logger.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  }
);

export default applicationsRouter;
