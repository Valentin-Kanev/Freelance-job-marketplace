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
const express_1 = require("express");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jobsRouter = (0, express_1.Router)();
jobsRouter.get("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield db_1.db.select().from(schema_1.Job);
        res.json(jobs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving jobs" });
    }
}));
jobsRouter.post("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.db.insert(schema_1.Job).values({
            client_id,
            title,
            description,
            budget,
            deadline: parsedDeadline,
        });
        res.status(201).json({ message: "Job created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error posting job" });
    }
}));
jobsRouter.put("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, budget, deadline } = req.body;
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
        return res
            .status(400)
            .json({ message: "Invalid date format for deadline" });
    }
    try {
        const updatedJob = yield db_1.db
            .update(schema_1.Job)
            .set({ title, description, budget, deadline: parsedDeadline })
            .where((0, drizzle_orm_1.eq)(schema_1.Job.id, id));
        if (updatedJob) {
            res.json({ message: "Job updated successfully" });
        }
        else {
            res.status(404).json({ message: "Job not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating job" });
    }
}));
jobsRouter.delete("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
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
