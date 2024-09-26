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
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
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
            .where((0, drizzle_orm_1.eq)(schema_1.User.user_type, "FREELANCER"));
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Failed to retrieve profiles" });
    }
}));
// Route to create a new freelancer profile
router.post("/profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.put("/profiles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.id, id)) // Update based on profile ID
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
