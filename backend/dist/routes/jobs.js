"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const jobsRouter = (0, express_1.Router)();
jobsRouter.get("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield db_1.db
            .select({
            id: schema_1.Job.id,
            title: schema_1.Job.title,
            description: schema_1.Job.description,
            budget: schema_1.Job.budget,
            deadline: schema_1.Job.deadline,
            client_id: schema_1.Job.client_id,
            client_username: schema_1.User.username, // Fetch the client's username
        })
            .from(schema_1.Job)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.User.id, schema_1.Job.client_id));
        res.json(jobs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving jobs" });
    }
}));
// Add the PUT route to update an existing job by ID
jobsRouter.put("/jobs/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the job ID from the URL
    const { title, description, budget, deadline } = req.body; // Data from the client
    const userType = req.user.user_type; // Check if user is a client
    // Ensure only clients can edit jobs
    if (userType !== "client") {
        return res.status(403).json({ message: "Only clients can edit jobs" });
    }
    try {
        const updatedJob = yield db_1.db
            .update(schema_1.Job)
            .set({ title, description, budget, deadline: new Date(deadline) })
            .where((0, drizzle_orm_1.eq)(schema_1.Job.id, id));
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json({ message: "Job updated successfully" });
    }
    catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Error updating job" });
    }
}));
// Add this route to your `jobsRouter` in the backend to fetch a job by ID.
jobsRouter.get("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield db_1.db
            .select({
            id: schema_1.Job.id,
            title: schema_1.Job.title,
            description: schema_1.Job.description,
            budget: schema_1.Job.budget,
            deadline: schema_1.Job.deadline,
            client_id: schema_1.Job.client_id,
            clientUsername: schema_1.User.username, // Add client's username
        })
            .from(schema_1.Job)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.User.id, schema_1.Job.client_id))
            .where((0, drizzle_orm_1.eq)(schema_1.Job.id, id))
            .limit(1);
        if (!job.length) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job[0]); // Return the job with client’s username
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving job" });
    }
}));
// Add route for creating a new job
jobsRouter.post("/jobs", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.id;
    const userType = req.user.user_type;
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
        const newJob = yield db_1.db.insert(schema_1.Job).values({
            client_id: userId,
            title,
            description,
            budget,
            deadline: parsedDeadline,
        });
        res.status(201).json(newJob); // Return the created job
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating job" });
    }
}));
jobsRouter.delete("/jobs/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userType = req.user.user_type; // Get user type
    // Check if the user is a client
    if (userType !== "client") {
        return res.status(403).json({ message: "Only clients can delete jobs" });
    }
    try {
        const deletedJob = yield db_1.db.delete(schema_1.Job).where((0, drizzle_orm_1.eq)(schema_1.Job.id, id));
        if (deletedJob) {
            res.json({ message: "Job deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Job not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting job" });
    }
}));
exports.default = jobsRouter;
