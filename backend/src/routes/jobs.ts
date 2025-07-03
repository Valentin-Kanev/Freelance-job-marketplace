import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { Application, Job, User } from "../drizzle/schema";
import { and, eq, ilike, isNull, sql } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { validate } from "../middleware/validate";
import {
  SearchJobValidation,
  CreateJobValidation,
  UpdateJobValidation,
  createJobSchema,
  updateJobSchema,
} from "../schemas/jobValidationSchema";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { CustomResponse, JobUpdateResponse } from "../types/responseTypes";
import { logger } from "../middleware/logger";

const jobsRouter = Router();

jobsRouter.get("/jobs/search", async (req: Request, res: Response) => {
  const { title } = req.query as SearchJobValidation;

  try {
    const job = await db
      .select({ job_id: Job.job_id, title: Job.title })
      .from(Job)
      .where(and(ilike(Job.title, `%${title}%`), isNull(Job.deleted_at)));

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
        job_id: Job.job_id,
        title: Job.title,
        description: Job.description,
        budget: Job.budget,
        deadline: Job.deadline,
        client_id: Job.client_id,
        client_username: User.username,
        deleted_at: Job.deleted_at,
      })
      .from(Job)
      .leftJoin(User, eq(User.user_id, Job.client_id))
      .where(isNull(Job.deleted_at));

    res.json(jobs);
  } catch (error) {
    logger.error("Error retrieving jobs:", error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.put(
  "/jobs/:job_id",
  authenticateToken,
  validate(updateJobSchema),
  async (
    req: AuthenticatedRequest<UpdateJobValidation>,
    res: Response<CustomResponse<JobUpdateResponse>>
  ) => {
    const job_id = req.params.job_id;
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.user_id;

    try {
      const updatedJob = await db.query.Job.findFirst({
        where: eq(Job.job_id, job_id),
      });

      if (!updatedJob) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      if (updatedJob.client_id !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
        return;
      }

      if (title) {
        const duplicateTitle = await db.query.Job.findFirst({
          where: and(
            isNull(Job.deleted_at),
            sql`"job_id" != ${job_id}`,
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
            isNull(Job.deleted_at),
            sql`"job_id" != ${job_id}`,
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
        .where(eq(Job.job_id, job_id))
        .execute();

      const jobAfterUpdate = await db.query.Job.findFirst({
        where: eq(Job.job_id, job_id),
      });

      if (!jobAfterUpdate) {
        res.status(404).json({ message: "Job not found after update" });
        return;
      }

      const responseJob: JobUpdateResponse = {
        job_id: Number(jobAfterUpdate.job_id),
        title: jobAfterUpdate.title,
        description: jobAfterUpdate.description,
        budget:
          jobAfterUpdate.budget === null ? 0 : Number(jobAfterUpdate.budget),
        deadline: jobAfterUpdate.deadline
          ? new Date(jobAfterUpdate.deadline).toISOString().slice(0, 10)
          : null,
        client_id: Number(jobAfterUpdate.client_id),
        deleted_at: jobAfterUpdate.deleted_at
          ? new Date(jobAfterUpdate.deleted_at).toISOString()
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

jobsRouter.get("/jobs/:job_id", async (req: Request, res: Response) => {
  const { job_id } = req.params;
  try {
    const job = await db.query.Job.findFirst({
      where: and(eq(Job.job_id, Number(job_id)), isNull(Job.deleted_at)),
    });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    const client = await db.query.User.findFirst({
      where: eq(User.user_id, job.client_id),
      columns: { username: true },
    });

    const jobWithUsername = {
      ...job,
      client_username: client?.username,
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
    const userId = req.user.user_id;

    try {
      const duplicateTitle = await db.query.Job.findFirst({
        where: and(isNull(Job.deleted_at), eq(Job.title, title)),
      });
      if (duplicateTitle) {
        res
          .status(409)
          .json({ message: "A job with this title already exists." });
        return;
      }
      const duplicateDescription = await db.query.Job.findFirst({
        where: and(isNull(Job.deleted_at), eq(Job.description, description)),
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
          client_id: userId,
          title,
          description,
          budget: sql`${budget}`,
          deadline: deadline ? sql`${new Date(deadline).toISOString()}` : null,
        })
        .returning({ id: Job.job_id });

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
  "/jobs/:job_id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response<CustomResponse<string>>) => {
    const { job_id } = req.params;
    const userId = req.user.user_id;

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.job_id, job_id),
      });

      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      if (job.client_id !== userId) {
        res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
        return;
      }

      await db.transaction(async (trx) => {
        await trx
          .update(Job)
          .set({ deleted_at: new Date() })
          .where(eq(Job.job_id, job_id));

        await trx
          .update(Application)
          .set({ deleted_at: new Date() })
          .where(eq(Application.job_id, job_id));
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
          job_id: Job.job_id,
          title: Job.title,
          description: Job.description,
          budget: Job.budget,
          deadline: Job.deadline,
          client_id: Job.client_id,
          client_username: User.username,
        })
        .from(Job)
        .leftJoin(User, eq(User.user_id, Job.client_id))
        .where(and(eq(Job.client_id, clientId), isNull(Job.deleted_at)));

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

export default jobsRouter;
