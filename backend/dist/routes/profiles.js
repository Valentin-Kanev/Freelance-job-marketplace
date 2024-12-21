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
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const router = (0, express_1.Router)();
// Route to retrieve all freelancer profiles
router.get("/profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield db_1.db
            .select({
            profileId: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
            username: schema_1.User.username,
        })
            .from(schema_1.Profile)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.User.user_type, "freelancer"));
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Failed to retrieve profiles" });
    }
}));
// Route to retrieve a specific user profile by userId
router.get("/profiles/user/:user_id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: userId } = req.params; // Use user_id directly from params
    if (!userId) {
        return res.status(400).json({ message: "User ID not provided" });
    }
    try {
        const profile = yield db_1.db
            .select({
            profileId: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
            username: schema_1.User.username,
        })
            .from(schema_1.Profile)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.user_id, userId)); // Compare by user_id
        if (profile.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile[0]); // Send only the first item
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Route to create a new freelancer profile
router.post("/profiles", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, skills, description, hourly_rate } = req.body;
    try {
        const newProfile = yield db_1.db
            .insert(schema_1.Profile)
            .values({
            user_id,
            skills,
            description,
            hourly_rate,
        })
            .returning({
            id: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
        });
        res.status(201).json(newProfile);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create profile" });
    }
}));
// Route to update a freelancer’s profile by ID
router.put("/profiles/user/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { skills, description, hourly_rate } = req.body;
    try {
        const updatedProfile = yield db_1.db
            .update(schema_1.Profile)
            .set({
            skills,
            description,
            hourly_rate,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.id, id)) // Ensure this matches Profile.id
            .returning({
            id: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
        });
        if (updatedProfile.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
}));
exports.default = router;
