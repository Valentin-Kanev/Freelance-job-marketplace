import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { Job, User } from "../drizzle/schema";
import { eq, ilike, sql } from "drizzle-orm";
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

const jobsRouter = Router();

jobsRouter.get("/jobs/search", async (req: Request, res: Response) => {
  const { title } = req.query as SearchJobValidation;

  try {
    const job = await db
      .select({ job_id: Job.job_id, title: Job.title })
      .from(Job)
      .where(ilike(Job.title, `%${title}%`));

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
      })
      .from(Job)
      .leftJoin(User, eq(User.user_id, Job.client_id));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.put(
  "/jobs/:job_id",
  authenticateToken,
  validate(updateJobSchema),
  async (req: AuthenticatedRequest<UpdateJobValidation>, res: Response) => {
    const { job_id } = req.params;
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.user_id;

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.job_id, job_id),
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.client_id !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
      }

      const result = await db
        .update(Job)
        .set({
          title,
          description,
          budget: sql`${budget}`,
          deadline: sql`${deadline}`,
        })
        .where(eq(Job.job_id, job_id))
        .execute();

      res.json({ message: "Job updated successfully" });
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Error updating job" });
    }
  }
);

jobsRouter.get("/jobs/:job_id", async (req: Request, res: Response) => {
  const { job_id } = req.params;
  try {
    const job = await db.query.Job.findFirst({
      where: eq(Job, job_id),
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
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
    res.status(500).json({ message: "Error retrieving job" });
  }
});

jobsRouter.post(
  "/jobs",
  authenticateToken,
  validate(createJobSchema),
  async (req: AuthenticatedRequest<CreateJobValidation>, res: Response) => {
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.user_id;

    try {
      const newJob = await db.insert(Job).values({
        client_id: userId,
        title,
        description,
        budget: sql`${budget}`,
        deadline: sql`${deadline}`,
      });

      res.status(201).json(newJob);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Error creating job" });
    }
  }
);

jobsRouter.delete(
  "/jobs/:job_id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { job_id } = req.params;
    const userId = req.user.user_id;

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.job_id, job_id),
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.client_id !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized: You don't own this job" });
      }

      await db.delete(Job).where(eq(Job.job_id, job_id));
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
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
          id: Job.job_id,
          title: Job.title,
          description: Job.description,
          budget: Job.budget,
          deadline: Job.deadline,
          client_id: Job.client_id,
          client_username: User.username,
        })
        .from(Job)
        .leftJoin(User, eq(User.user_id, Job.client_id))
        .where(eq(Job.client_id, clientId));

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

export default jobsRouter;
