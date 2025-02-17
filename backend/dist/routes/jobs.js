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
const validate_1 = require("../middleware/validate");
const jobValidationSchema_1 = require("../schemas/jobValidationSchema");
const jobsRouter = (0, express_1.Router)();
jobsRouter.get("/jobs/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.query;
    try {
        const titleSearch = title;
        const jobs = yield db_1.db
            .select({ id: schema_1.Job.id, title: schema_1.Job.title })
            .from(schema_1.Job)
            .where((0, drizzle_orm_1.ilike)(schema_1.Job.title, `%${titleSearch}%`));
        res.status(200).json(jobs);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res
            .status(500)
            .json({ message: "Error searching jobs", error: errorMessage });
    }
}));
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
            client_username: schema_1.User.username,
        })
            .from(schema_1.Job)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.User.id, schema_1.Job.client_id));
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving jobs" });
    }
}));
jobsRouter.put("/jobs/:id", authenticateToken_1.default, (0, validate_1.validate)(jobValidationSchema_1.jobUpdateSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, budget, deadline } = req.body;
    const userType = req.user.user_type;
    if (userType !== "client") {
        return res.status(403).json({ message: "Only clients can edit jobs" });
    }
    try {
        yield db_1.db
            .update(schema_1.Job)
            .set({
            title,
            description,
            budget,
            deadline,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.Job.id, id));
        res.json({ message: "Job updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating job" });
    }
}));
jobsRouter.get("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield db_1.db.query.Job.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.Job.id, id),
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const client = yield db_1.db.query.User.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.User.id, job.client_id),
            columns: { username: true },
        });
        const jobWithUsername = Object.assign(Object.assign({}, job), { clientUsername: (client === null || client === void 0 ? void 0 : client.username) || null });
        res.json(jobWithUsername);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving job" });
    }
}));
jobsRouter.post("/jobs", authenticateToken_1.default, (0, validate_1.validate)(jobValidationSchema_1.jobSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.id;
    const userType = req.user.user_type;
    if (userType !== "client") {
        return res.status(403).json({ message: "Only clients can create jobs" });
    }
    try {
        const newJob = yield db_1.db.insert(schema_1.Job).values({
            client_id: userId,
            title,
            description,
            budget,
            deadline,
        });
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating job" });
    }
}));
jobsRouter.delete("/jobs/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { id: userId, user_type } = req.user;
    if (user_type !== "client") {
        return res.status(403).json({ message: "Only clients can delete jobs" });
    }
    try {
        const job = yield db_1.db.query.Job.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.Job.id, id),
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.client_id !== userId) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this job" });
        }
        yield db_1.db.delete(schema_1.Job).where((0, drizzle_orm_1.eq)(schema_1.Job.id, id));
        res.json({ message: "Job deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting job" });
    }
}));
jobsRouter.get("/jobs/created-by/:clientId", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const { id: loggedInUserId, user_type } = req.user;
    if (user_type !== "client" || clientId !== loggedInUserId) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
        const jobs = yield db_1.db
            .select({
            id: schema_1.Job.id,
            title: schema_1.Job.title,
            description: schema_1.Job.description,
            budget: schema_1.Job.budget,
            deadline: schema_1.Job.deadline,
            client_id: schema_1.Job.client_id,
            client_username: schema_1.User.username,
        })
            .from(schema_1.Job)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.User.id, schema_1.Job.client_id))
            .where((0, drizzle_orm_1.eq)(schema_1.Job.client_id, clientId));
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
}));
exports.default = jobsRouter;
