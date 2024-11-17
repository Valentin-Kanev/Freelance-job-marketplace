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
        client_username: User.username, // Fetch the client's username
      })
      .from(Job)
      .leftJoin(User, eq(User.id, Job.client_id));

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

// Add the PUT route to update an existing job by ID
jobsRouter.put("/jobs/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Get the job ID from the URL
  const { title, description, budget, deadline } = req.body; // Data from the client
  const userType = (req.user as JwtPayload).user_type; // Check if user is a client

  // Ensure only clients can edit jobs
  if (userType !== "client") {
    return res.status(403).json({ message: "Only clients can edit jobs" });
  }

  try {
    const updatedJob = await db
      .update(Job)
      .set({ title, description, budget, deadline: new Date(deadline) })
      .where(eq(Job.id, id));

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Error updating job" });
  }
});

// Add this route to your `jobsRouter` in the backend to fetch a job by ID.
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
        clientUsername: User.username, // Add client's username
      })
      .from(Job)
      .leftJoin(User, eq(User.id, Job.client_id))
      .where(eq(Job.id, id))
      .limit(1);

    if (!job.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job[0]); // Return the job with client’s username
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving job" });
  }
});

// Add route for creating a new job
jobsRouter.post("/jobs", authenticateToken, async (req, res) => {
  const { title, description, budget, deadline } = req.body;
  const userId = (req.user as JwtPayload).id;
  const userType = (req.user as JwtPayload).user_type;

  // Ensure only clients can create jobs
  if (userType !== "client") {
    return res.status(403).json({ message: "Only clients can create jobs" });
  }

  // Validate input fields
  if (!title || !description || !budget || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedDeadline = new Date(deadline); // Make sure this is valid
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
    res.status(201).json(newJob); // Return the created job
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating job" });
  }
});

jobsRouter.delete("/jobs/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userType = (req.user as JwtPayload).user_type; // Get user type

  // Check if the user is a client
  if (userType !== "client") {
    return res.status(403).json({ message: "Only clients can delete jobs" });
  }

  try {
    const deletedJob = await db.delete(Job).where(eq(Job.id, id));

    if (deletedJob) {
      res.json({ message: "Job deleted successfully" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

export default jobsRouter;
