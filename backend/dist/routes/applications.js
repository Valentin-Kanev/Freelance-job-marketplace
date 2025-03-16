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
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const schema_1 = require("../drizzle/schema");
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../drizzle/db");
const applicationValidationSchema_1 = require("../schemas/applicationValidationSchema");
const validate_1 = require("../middleware/validate");
const applicationsRouter = (0, express_1.Router)();
applicationsRouter.post("/jobs/:id/apply", (0, validate_1.validate)(applicationValidationSchema_1.createApplicationSchema), authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params;
    const { cover_letter } = req.body;
    const { id: freelancer_id } = req.user;
    try {
        const existingApplication = yield db_1.db.query.Application.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Application.job_id, job_id), (0, drizzle_orm_1.eq)(schema_1.Application.freelancer_id, freelancer_id)),
        });
        if (existingApplication) {
            return res
                .status(400)
                .json({ message: "You have already applied for this job" });
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
applicationsRouter.get("/jobs/:id/applications", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params;
    try {
        const applications = yield db_1.db
            .select({
            id: schema_1.Application.id,
            cover_letter: schema_1.Application.cover_letter,
            freelancer_id: schema_1.Application.freelancer_id,
            username: schema_1.User.username,
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
applicationsRouter.get("/applications/my-applications", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.json(applications);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Error fetching applications" });
    }
}));
exports.default = applicationsRouter;
