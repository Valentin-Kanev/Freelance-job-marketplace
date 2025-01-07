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
const express_1 = require("express");
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const schema_1 = require("../drizzle/schema");
const reviewsRouter = (0, express_1.Router)();
reviewsRouter.post("/:id/reviews", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: freelancer_id } = req.params;
    const { client_id, rating, review_text } = req.body;
    if (!client_id || !rating || !review_text) {
        return res
            .status(400)
            .json({ message: "Client ID, rating, and review text are required" });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    try {
        const profile = yield db_1.db
            .select()
            .from(schema_1.Profile)
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.user_id, freelancer_id))
            .limit(1);
        if (profile.length === 0) {
            return res.status(404).json({ message: "Freelancer not found" });
        }
        const existingReview = yield db_1.db
            .select()
            .from(schema_1.Review)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Review.freelancer_id, freelancer_id), (0, drizzle_orm_1.eq)(schema_1.Review.client_id, client_id)))
            .limit(1);
        if (existingReview.length > 0) {
            return res
                .status(400)
                .json({
                message: "You have already submitted a review for this freelancer.",
            });
        }
        yield db_1.db
            .insert(schema_1.Review)
            .values({ freelancer_id, client_id, rating, review_text });
        res.status(201).json({ message: "Review posted successfully" });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res
            .status(500)
            .json({ message: "Error posting review", error: errorMessage });
    }
}));
reviewsRouter.get("/:id/reviews", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: profile_id } = req.params;
    try {
        const profile = yield db_1.db
            .select()
            .from(schema_1.Profile)
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.id, profile_id))
            .limit(1);
        if (profile.length === 0) {
            return res.status(404).json({ message: "Freelancer profile not found" });
        }
        const user_id = profile[0].user_id;
        const reviews = yield db_1.db
            .select({
            id: schema_1.Review.id,
            freelancer_id: schema_1.Review.freelancer_id,
            client_id: schema_1.Review.client_id,
            rating: schema_1.Review.rating,
            review_text: schema_1.Review.review_text,
            client_username: schema_1.User.username,
        })
            .from(schema_1.Review)
            .innerJoin(schema_1.Profile, (0, drizzle_orm_1.eq)(schema_1.Review.client_id, schema_1.Profile.user_id))
            .innerJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Review.freelancer_id, user_id));
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving reviews" });
    }
}));
reviewsRouter.get("/client/:clientId", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    try {
        const reviews = yield db_1.db
            .select({
            id: schema_1.Review.id,
            freelancer_id: schema_1.Review.freelancer_id,
            client_id: schema_1.Review.client_id,
            rating: schema_1.Review.rating,
            review_text: schema_1.Review.review_text,
            freelancer_username: schema_1.User.username,
        })
            .from(schema_1.Review)
            .innerJoin(schema_1.Profile, (0, drizzle_orm_1.eq)(schema_1.Review.freelancer_id, schema_1.Profile.user_id))
            .innerJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Review.client_id, clientId));
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving client reviews" });
    }
}));
exports.default = reviewsRouter;
