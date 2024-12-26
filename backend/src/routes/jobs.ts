import { Router } from "express";
import { db } from "../drizzle/db";
import { Job, User } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { JwtPayload } from "jsonwebtoken";

const jobsRouter = Router();

jobsRouter.get("/jobs", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.put("/jobs/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, budget, deadline } = req.body;
  const userType = (req.user as JwtPayload).user_type;

  if (userType !== "client") {
    return res.status(403).json({ message: "Only clients can edit jobs" });
  }

  let parsedDeadline;
  if (deadline) {
    parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format for deadline" });
    }
  }

  try {
    const updatedJob = await db
      .update(Job)
      .set({
        title,
        description,
        budget,
        ...(parsedDeadline && { deadline: parsedDeadline }),
      })
      .where(eq(Job.id, id));

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Error updating job" });
  }
});

jobsRouter.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await db
      .select({
        id: Job.id,
        title: Job.title,
        description: Job.description,
        budget: Job.budget,
        deadline: Job.deadline,
        client_id: Job.client_id,
        clientUsername: User.username,
      })
      .from(Job)
      .leftJoin(User, eq(User.id, Job.client_id))
      .where(eq(Job.id, id))
      .limit(1);

    if (!job.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving job" });
  }
});

jobsRouter.post("/jobs", authenticateToken, async (req, res) => {
  const { title, description, budget, deadline } = req.body;
  const userId = (req.user as JwtPayload).id;
  const userType = (req.user as JwtPayload).user_type;

  if (userType !== "client") {
    return res.status(403).json({ message: "Only clients can create jobs" });
  }

  if (!title || !description || !budget || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedDeadline = new Date(deadline);
  if (isNaN(parsedDeadline.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid date format for deadline" });
  }

  try {
    const newJob = await db.insert(Job).values({
      client_id: userId,
      title,
      description,
      budget,
      deadline: parsedDeadline,
    });
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Error creating job" });
  }
});

jobsRouter.delete("/jobs/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { id: userId, user_type } = req.user as JwtPayload;

  if (user_type !== "client") {
    return res.status(403).json({ message: "Only clients can delete jobs" });
  }

  try {
    const job = await db.select().from(Job).where(eq(Job.id, id)).limit(1);

    if (!job.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job[0].client_id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    await db.delete(Job).where(eq(Job.id, id));
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

jobsRouter.get(
  "/jobs/created-by/:clientId",
  authenticateToken,
  async (req, res) => {
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
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

export default jobsRouter;
