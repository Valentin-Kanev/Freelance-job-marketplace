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
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../drizzle/schema");
const db_1 = require("../drizzle/db");
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const applicationsRouter = (0, express_1.Router)();
applicationsRouter.post("/jobs/:id/apply", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params; // Job ID from the URL
    const { freelancer_id, cover_letter } = req.body; // Freelancer ID and cover letter from the request body
    if (!freelancer_id || !cover_letter) {
        return res
            .status(400)
            .json({ message: "Freelancer ID and cover letter are required" });
    }
    try {
        // Check if the job exists
        const job = yield db_1.db.select().from(schema_1.Job).where((0, drizzle_orm_1.eq)(schema_1.Job.id, job_id)).limit(1);
        if (job.length === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        // Insert a new application
        yield db_1.db.insert(schema_1.Application).values({
            job_id,
            freelancer_id,
            cover_letter,
        });
        res.status(201).json({ message: "Application submitted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error applying for the job" });
    }
}));
applicationsRouter.get("/jobs/:id/applications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: job_id } = req.params;
    try {
        // Fetch all applications for the job
        const applications = yield db_1.db
            .select()
            .from(schema_1.Application)
            .where((0, drizzle_orm_1.eq)(schema_1.Application.job_id, job_id));
        if (applications.length === 0) {
            return res
                .status(404)
                .json({ message: "No applications found for this job" });
        }
        res.json(applications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving applications" });
    }
}));
exports.default = applicationsRouter;
