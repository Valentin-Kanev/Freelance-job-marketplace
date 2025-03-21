"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSearchSchema = exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(10, "Title must be at least 10 characters")
        .max(80, "Title is too long. It must be less than 80 characters"),
    description: zod_1.z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(1500, "Description is too long. It must be less than 1500 characters"),
    budget: zod_1.z.number().nonnegative("Budget must be a positive number"),
    deadline: zod_1.z.preprocess((date) => (typeof date === "string" ? new Date(date) : date), zod_1.z.date({
        required_error: "Deadline is required",
        invalid_type_error: "Invalid date format for deadline",
    })),
});
exports.updateJobSchema = exports.createJobSchema.partial();
exports.jobSearchSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title query parameter is required"),
});
