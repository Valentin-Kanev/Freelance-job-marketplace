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
const reviewsRouter = (0, express_1.Router)();
reviewsRouter.post("/profiles/:id/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: freelancer_id } = req.params; // Freelancer (Profile) ID from the URL
    const { client_id, rating, review_text } = req.body; // Client ID, rating, and review text from the request body
    if (!client_id || !rating || !review_text) {
        return res
            .status(400)
            .json({ message: "Client ID, rating, and review text are required" });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    try {
        // Check if the freelancer exists (you might also want to check if the user is a freelancer)
        const profile = yield db_1.db
            .select()
            .from(schema_1.Profile)
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.id, freelancer_id))
            .limit(1);
        if (profile.length === 0) {
            return res.status(404).json({ message: "Freelancer not found" });
        }
        // Use the user_id from the profile table to post the review
        yield db_1.db.insert(schema_1.Review).values({
            freelancer_id: profile[0].user_id, // Make sure to use the user_id
            client_id,
            rating,
            review_text,
        });
        res.status(201).json({ message: "Review posted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error posting review" });
    }
}));
reviewsRouter.get("/profiles/:id/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: freelancer_id } = req.params; // Freelancer (Profile) ID from the URL
    try {
        // Fetch all reviews for the freelancer
        const reviews = yield db_1.db
            .select()
            .from(schema_1.Review)
            .where((0, drizzle_orm_1.eq)(schema_1.Review.freelancer_id, freelancer_id));
        if (reviews.length === 0) {
            return res
                .status(404)
                .json({ message: "No reviews found for this freelancer" });
        }
        res.json(reviews);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving reviews" });
    }
}));
exports.default = reviewsRouter;
