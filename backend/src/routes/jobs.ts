import { Router } from "express";
import { db } from "../drizzle/db";
import { Job } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const jobsRouter = Router();

jobsRouter.get("/jobs", async (req, res) => {
  try {
    const jobs = await db.select().from(Job);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

jobsRouter.post("/jobs", async (req, res) => {
  const { client_id, title, description, budget, deadline } = req.body;

  if (!client_id || !title || !description || !budget || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedDeadline = new Date(deadline);

  if (isNaN(parsedDeadline.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid date format for deadline" });
  }

  try {
    await db.insert(Job).values({
      client_id,
      title,
      description,
      budget,
      deadline: parsedDeadline,
    });
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error posting job" });
  }
});

jobsRouter.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, budget, deadline } = req.body;

  const parsedDeadline = new Date(deadline);

  if (isNaN(parsedDeadline.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid date format for deadline" });
  }

  try {
    const updatedJob = await db
      .update(Job)
      .set({ title, description, budget, deadline: parsedDeadline })
      .where(eq(Job.id, id));

    if (updatedJob) {
      res.json({ message: "Job updated successfully" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating job" });
  }
});

jobsRouter.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;

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
