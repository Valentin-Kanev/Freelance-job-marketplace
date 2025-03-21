"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password is too long. It must be less than 20 characters"),
    username: zod_1.z
        .string()
        .min(4, "Username is required")
        .max(18, "Username is too long. It must be less than 18 characters"),
    user_type: zod_1.z.ZodEnum.create(["client", "freelancer"]),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Invalid password"),
});
