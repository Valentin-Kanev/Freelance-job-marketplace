"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.createProfileSchema = void 0;
const zod_1 = require("zod");
exports.createProfileSchema = zod_1.z.object({
    skills: zod_1.z
        .string()
        .min(4, "Skills are required")
        .max(100, "Skills are too long. They must be less than 200 characters"),
    description: zod_1.z
        .string()
        .min(1, "Description is required")
        .max(500, "Description is too long. It must be less than 500 characters"),
    hourly_rate: zod_1.z.string().min(1, "Hourly rate is required"),
});
exports.updateProfileSchema = exports.createProfileSchema.partial();
