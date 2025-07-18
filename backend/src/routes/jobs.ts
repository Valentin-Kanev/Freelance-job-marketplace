import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { Application, Job, User } from "../drizzle/schema";
import { and, eq, ilike, isNull, sql } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { validate } from "../middleware/validate";
import {
  SearchJobValidation,
  CreateJobValidation,
  editJobValidation,
  createJobSchema,
  editJobSchema,
} from "../schemas/jobValidationSchema";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { CustomResponse, jobEditResponse } from "../types/responseTypes";
import { logger } from "../middleware/logger";

const jobsRouter = Router();

jobsRouter.get("/jobs/search", async (req: Request, res: Response) => {
  const { title } = req.query as SearchJobValidation;

  try {
    const job = await db
      .select({ jobId: Job.jobId, title: Job.title })
      .from(Job)
      .where(and(ilike(Job.title, `%${title}%`), isNull(Job.deletedAt)));

    res.status(200).json(job);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error searching job", error: errorMessage });
  }
});

jobsRouter.get("/jobs", async (req: Request, res: Response) => {
  try {
    const jobs = await db
      .select({
        jobId: Job.jobId,
        title: Job.title,
        description: Job.description,
        budget: Job.budget,
        deadline: Job.deadline,
        clientId: Job.clientId,
        clientUsername: User.username,
        deletedAt: Job.deletedAt,
      })
      .from(Job)
      .leftJoin(User, eq(User.userId, Job.clientId))
      .where(isNull(Job.deletedAt));

    res.json(jobs);
  } catch (error) {
    logger.error("Error retrieving jobs:", error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.put(
  "/jobs/:jobId",
  authenticateToken,
  validate(editJobSchema),
  async (
    req: AuthenticatedRequest<editJobValidation>,
    res: Response<CustomResponse<jobEditResponse>>
  ) => {
    const jobId = Number(req.params.jobId);
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.userId;

    try {
      const editedJob = await db.query.Job.findFirst({
        where: eq(Job.jobId, jobId),
      });

      if (!editedJob) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      if (editedJob.clientId !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
        return;
      }

      if (title) {
        const duplicateTitle = await db.query.Job.findFirst({
          where: and(
            isNull(Job.deletedAt),
            sql`"job_id" != ${jobId}`,
            eq(Job.title, title)
          ),
        });
        if (duplicateTitle) {
          res
            .status(409)
            .json({ message: "A job with this title already exists." });
          return;
        }
      }
      if (description) {
        const duplicateDescription = await db.query.Job.findFirst({
          where: and(
            isNull(Job.deletedAt),
            sql`"job_id" != ${jobId}`,
            eq(Job.description, description)
          ),
        });
        if (duplicateDescription) {
          res
            .status(409)
            .json({ message: "A job with this description already exists." });
          return;
        }
      }

      const updateData: {
        title?: string;
        description?: string;
        budget?: number;
        deadline?: Date | null;
      } = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (budget !== undefined) updateData.budget = budget;
      if (deadline !== undefined)
        updateData.deadline = deadline ? new Date(deadline) : null;

      await db
        .update(Job)
        .set({
          ...updateData,
          ...(updateData.deadline !== undefined && updateData.deadline !== null
            ? { deadline: sql`${updateData.deadline.toISOString()}` }
            : {}),
        })
        .where(eq(Job.jobId, jobId))
        .execute();

      const jobAfterUpdate = await db.query.Job.findFirst({
        where: eq(Job.jobId, jobId),
      });

      if (!jobAfterUpdate) {
        res.status(404).json({ message: "Job not found after update" });
        return;
      }

      const responseJob: jobEditResponse = {
        jobId: Number(jobAfterUpdate.jobId),
        title: jobAfterUpdate.title,
        description: jobAfterUpdate.description,
        budget:
          jobAfterUpdate.budget === null ? 0 : Number(jobAfterUpdate.budget),
        deadline: jobAfterUpdate.deadline
          ? new Date(jobAfterUpdate.deadline).toISOString().slice(0, 10)
          : null,
        clientId: Number(jobAfterUpdate.clientId),
        deletedAt: jobAfterUpdate.deletedAt
          ? new Date(jobAfterUpdate.deletedAt).toISOString()
          : null,
      };

      res.status(200).json({
        message: "Job updated successfully",
        data: responseJob,
      });
    } catch (error) {
      if (error instanceof Error) {
      }
      res.status(500).json({
        message: "Error updating job",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

jobsRouter.get("/jobs/:jobId", async (req: Request, res: Response) => {
  const { jobId } = req.params;
  try {
    const job = await db.query.Job.findFirst({
      where: and(eq(Job.jobId, Number(jobId)), isNull(Job.deletedAt)),
    });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    const client = await db.query.User.findFirst({
      where: eq(User.userId, job.clientId),
      columns: { username: true },
    });

    const jobWithUsername = {
      ...job,
      clientUsername: client?.username,
    };

    res.json(jobWithUsername);
  } catch (error) {
    logger.error("Error retrieving job:", error);
    res.status(500).json({ message: "Error retrieving job" });
  }
});

jobsRouter.post(
  "/jobs",
  authenticateToken,
  validate(createJobSchema),
  async (
    req: AuthenticatedRequest<CreateJobValidation>,
    res: Response<CustomResponse<number>>
  ) => {
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.userId;

    try {
      const duplicateTitle = await db.query.Job.findFirst({
        where: and(isNull(Job.deletedAt), eq(Job.title, title)),
      });
      if (duplicateTitle) {
        res
          .status(409)
          .json({ message: "A job with this title already exists." });
        return;
      }
      const duplicateDescription = await db.query.Job.findFirst({
        where: and(isNull(Job.deletedAt), eq(Job.description, description)),
      });
      if (duplicateDescription) {
        res
          .status(409)
          .json({ message: "A job with this description already exists." });
        return;
      }

      const [newJob] = await db
        .insert(Job)
        .values({
          clientId: userId,
          title,
          description,
          budget: sql`${budget}`,
          deadline: deadline ? sql`${new Date(deadline).toISOString()}` : null,
        })
        .returning({ id: Job.jobId });

      res
        .status(201)
        .json({ data: newJob.id, message: "Job created successfully" });
      logger.info("Job created successfully:", newJob.id);
    } catch (error) {
      logger.error("Error creating job:", error);
      res.status(500).json({ message: "Error creating job" });
    }
  }
);

jobsRouter.patch(
  "/jobs/:jobId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response<CustomResponse<string>>) => {
    const { jobId } = req.params;
    const userId = req.user.userId;

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.jobId, jobId),
      });

      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      if (job.clientId !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
        return;
      }

      await db.transaction(async (trx) => {
        await trx
          .update(Job)
          .set({ deletedAt: new Date() })
          .where(eq(Job.jobId, jobId));

        await trx
          .update(Application)
          .set({ deletedAt: new Date() })
          .where(eq(Application.jobId, jobId));
      });

      res.json({
        message: "Job and related applications deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting job:", error);
      res.status(500).json({ message: "Error deleting job" });
    }
  }
);

jobsRouter.get(
  "/jobs/created-by/:clientId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { clientId } = req.params;

    try {
      const jobs = await db
        .select({
          jobId: Job.jobId,
          title: Job.title,
          description: Job.description,
          budget: Job.budget,
          deadline: Job.deadline,
          clientId: Job.clientId,
          clientUsername: User.username,
        })
        .from(Job)
        .leftJoin(User, eq(User.userId, Job.clientId))
        .where(and(eq(Job.clientId, clientId), isNull(Job.deletedAt)));

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

export default jobsRouter;
