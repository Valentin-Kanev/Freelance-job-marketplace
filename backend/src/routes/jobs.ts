import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { Job, User } from "../drizzle/schema";
import { eq, ilike } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { JwtPayload } from "jsonwebtoken";
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
    const titleSearch = title as string;

    const job = await db
      .select({ id: Job.id, title: Job.title })
      .from(Job)
      .where(ilike(Job.title, `%${titleSearch}%`));

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
        id: Job.id,
        title: Job.title,
        description: Job.description,
        budget: Job.budget,
        deadline: Job.deadline,
        client_id: Job.client_id,
        client_username: User.username,
      })
      .from(Job)
      .leftJoin(User, eq(User.id, Job.client_id));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.put(
  "/jobs/:id",
  authenticateToken,
  validate(updateJobSchema),
  async (req: AuthenticatedRequest<UpdateJobValidation>, res: Response) => {
    const { id } = req.params;
    const { title, description, budget, deadline } = req.body;

    try {
      await db
        .update(Job)
        .set({
          title,
          description,
          budget: Number(budget).toString(),
          deadline,
        })
        .where(eq(Job.id, id));

      res.json({ message: "Job updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating job" });
    }
  }
);

jobsRouter.get("/jobs/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await db.query.Job.findFirst({
      where: eq(Job.id, id),
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const client = await db.query.User.findFirst({
      where: eq(User.id, job.client_id),
      columns: { username: true },
    });

    const jobWithUsername = {
      ...job,
      clientUsername: client?.username,
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
    const userId = req.user.id;

    try {
      const newJob = await db.insert(Job).values({
        client_id: userId,
        title,
        description,
        budget: Number(budget).toString(),
        deadline: new Date(deadline),
      });

      res.status(201).json(newJob);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Error creating job" });
    }
  }
);

jobsRouter.delete(
  "/jobs/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.id, id),
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      await db.delete(Job).where(eq(Job.id, id));
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
          id: Job.id,
          title: Job.title,
          description: Job.description,
          budget: Job.budget,
          deadline: Job.deadline,
          client_id: Job.client_id,
          client_username: User.username,
        })
        .from(Job)
        .leftJoin(User, eq(User.id, Job.client_id))
        .where(eq(Job.client_id, clientId));

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

export default jobsRouter;
