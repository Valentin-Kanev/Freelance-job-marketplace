"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageSchema = void 0;
const zod_1 = require("zod");
exports.createMessageSchema = zod_1.z.object({
    content: zod_1.z
        .string()
        .max(200, "Message content is too long. Must be less than 200 characters")
        .refine((val) => val.trim().length > 0, {
        message: "Message content cannot be empty",
    }),
});
