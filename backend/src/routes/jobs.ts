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
  jobSchema,
  jobUpdateSchema,
} from "../schemas/jobValidationSchema";

const jobsRouter = Router();

jobsRouter.get("/jobs/search", async (req: Request, res: Response) => {
  const { title } = req.query as SearchJobValidation;

  try {
    const titleSearch = title as string;

    const jobs = await db
      .select({ id: Job.id, title: Job.title })
      .from(Job)
      .where(ilike(Job.title, `%${titleSearch}%`));

    res.status(200).json(jobs);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error searching jobs", error: errorMessage });
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
  validate(jobUpdateSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, budget, deadline } =
      req.body as UpdateJobValidation;
    const userType = (req.user as JwtPayload).user_type;

    if (userType !== "client") {
      return res.status(403).json({ message: "Only clients can edit jobs" });
    }

    try {
      await db
        .update(Job)
        .set({
          title,
          description,
          budget,
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
      clientUsername: client?.username || null,
    };

    res.json(jobWithUsername);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving job" });
  }
});

jobsRouter.post(
  "/jobs",
  authenticateToken,
  validate(jobSchema),
  async (req: Request, res: Response) => {
    const { title, description, budget, deadline } =
      req.body as CreateJobValidation;

    const userId = (req.user as JwtPayload).id;
    const userType = (req.user as JwtPayload).user_type;

    if (userType !== "client") {
      return res.status(403).json({ message: "Only clients can create jobs" });
    }

    try {
      const newJob = await db.insert(Job).values({
        client_id: userId,
        title,
        description,
        budget,
        deadline,
      });
      res.status(201).json(newJob);
    } catch (error) {
      res.status(500).json({ message: "Error creating job" });
    }
  }
);

jobsRouter.delete(
  "/jobs/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId, user_type } = req.user as JwtPayload;

    if (user_type !== "client") {
      return res.status(403).json({ message: "Only clients can delete jobs" });
    }

    try {
      const job = await db.query.Job.findFirst({
        where: eq(Job.id, id),
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.client_id !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this job" });
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
    const { id: loggedInUserId, user_type } = req.user as JwtPayload;

    if (user_type !== "client" || clientId !== loggedInUserId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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
