"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    cover_letter: zod_1.z
        .string()
        .min(20, "Cover letter is required and must be at least 20 characters")
        .max(200, "Cover letter is too long. The maximum length is 200 characters"),
});
