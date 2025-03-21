"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1, "Rating must be between 1 and 5").max(5),
    review_text: zod_1.z
        .string()
        .min(5, "Review text is required")
        .min(200, "Review text must be at least 200 characters"),
});
