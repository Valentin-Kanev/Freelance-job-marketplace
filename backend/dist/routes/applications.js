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
const schema_1 = require("../drizzle/schema");
const db_1 = require("../drizzle/db");
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const applicationsRouter = (0, express_1.Router)();
// Type guard to ensure `req.user` has an `id`
function isAuthenticatedUser(user) {
    return !!user && typeof user !== "string" && "id" in user;
}
// POST route to apply for a job
applicationsRouter.post("/jobs/:id/apply", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params;
    const { freelancer_id, cover_letter } = req.body;
    if (!freelancer_id || !cover_letter) {
        return res.status(400).json({
            message: "Freelancer ID and cover letter are required",
        });
    }
    try {
        console.log("Job ID:", job_id, "Freelancer ID:", freelancer_id);
        const existingApplication = yield db_1.db
            .select()
            .from(schema_1.Application)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Application.job_id, job_id), (0, drizzle_orm_1.eq)(schema_1.Application.freelancer_id, freelancer_id)))
            .limit(1);
        if (existingApplication.length > 0) {
            return res
                .status(400)
                .json({ message: "You have already applied to this job" });
        }
        yield db_1.db.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            yield trx.insert(schema_1.Application).values({
                job_id,
                freelancer_id,
                cover_letter,
                timestamp: new Date(),
            });
        }));
        res.status(201).json({ message: "Application submitted successfully" });
    }
    catch (error) {
        console.error("Error applying for the job:", error);
        res.status(500).json({ message: "Error applying for the job", error });
    }
}));
// GET route to fetch all applications for a job (only accessible by the job creator)
applicationsRouter.get("/jobs/:id/applications", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params;
    // Type assertion for `req.user` after the type guard check
    if (!isAuthenticatedUser(req.user)) {
        return res
            .status(401)
            .json({ message: "Unauthorized: User not authenticated" });
    }
    const userId = req.user.id;
    try {
        // Verify that the job was created by the authenticated user
        const job = yield db_1.db
            .select()
            .from(schema_1.Job)
            .where((0, drizzle_orm_1.eq)(schema_1.Job.id, job_id))
            .limit(1);
        if (!job || job[0].client_id !== userId) {
            return res
                .status(403)
                .json({ message: "Unauthorized to view applications" });
        }
        // Retrieve all applications for the job
        const applications = yield db_1.db
            .select({
            id: schema_1.Application.id,
            cover_letter: schema_1.Application.cover_letter,
            freelancer_id: schema_1.Application.freelancer_id,
            username: schema_1.User.username, // Select username from the User table
        })
            .from(schema_1.Application)
            .innerJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Application.freelancer_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Application.job_id, job_id));
        res.json(applications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving applications" });
    }
}));
applicationsRouter.get("/applications/my-applications", // Corrected route
authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || typeof req.user === "string") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const freelancerId = req.user.id;
    try {
        const applications = yield db_1.db
            .select({
            jobId: schema_1.Application.job_id,
            jobTitle: schema_1.Job.title,
            coverLetter: schema_1.Application.cover_letter,
            applicationDate: schema_1.Application.timestamp,
        })
            .from(schema_1.Application)
            .innerJoin(schema_1.Job, (0, drizzle_orm_1.eq)(schema_1.Application.job_id, schema_1.Job.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Application.freelancer_id, freelancerId));
        console.log("Fetched applications:", applications);
        res.json(applications);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Error fetching applications" });
    }
}));
exports.default = applicationsRouter;
