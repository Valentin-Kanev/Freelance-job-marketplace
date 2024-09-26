import { Application, Job } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { Router } from "express";
import { eq } from "drizzle-orm";

const applicationsRouter = Router();

applicationsRouter.post("/jobs/:id/apply", async (req, res) => {
  const { id: job_id } = req.params; // Job ID from the URL
  const { freelancer_id, cover_letter } = req.body; // Freelancer ID and cover letter from the request body

  if (!freelancer_id || !cover_letter) {
    return res
      .status(400)
      .json({ message: "Freelancer ID and cover letter are required" });
  }

  try {
    // Check if the job exists
    const job = await db.select().from(Job).where(eq(Job.id, job_id)).limit(1);
    if (job.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Insert a new application
    await db.insert(Application).values({
      job_id,
      freelancer_id,
      cover_letter,
    });

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying for the job" });
  }
});

applicationsRouter.get("/jobs/:id/applications", async (req, res) => {
  const { id: job_id } = req.params;

  try {
    // Fetch all applications for the job
    const applications = await db
      .select()
      .from(Application)
      .where(eq(Application.job_id, job_id));

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving applications" });
  }
});

export default applicationsRouter;
