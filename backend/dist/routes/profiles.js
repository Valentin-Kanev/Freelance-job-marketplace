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
const validate_1 = require("../middleware/validate");
const profileValidationSchema_1 = require("../schemas/profileValidationSchema");
const router = (0, express_1.Router)();
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
            userType: schema_1.User.user_type,
        })
            .from(schema_1.Profile)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.User.user_type, "freelancer"));
        res.status(200).json(profiles);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve profiles" });
    }
}));
router.get("/profiles/user/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: userId } = req.params;
    try {
        const profile = yield db_1.db
            .select({
            profileId: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
            username: schema_1.User.username,
            userType: schema_1.User.user_type,
        })
            .from(schema_1.Profile)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.user_id, userId));
        res.status(200).json(profile[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/profiles", authenticateToken_1.default, (0, validate_1.validate)(profileValidationSchema_1.createProfileSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skills, description, hourly_rate } = req.body;
    const { id: user_id } = req.user;
    try {
        const newProfile = yield db_1.db
            .insert(schema_1.Profile)
            .values({ user_id, skills, description, hourly_rate })
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
router.put("/profiles/user/:id", authenticateToken_1.default, (0, validate_1.validate)(profileValidationSchema_1.updateProfileSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { skills, description, hourly_rate } = req.body;
    try {
        const updatedProfile = yield db_1.db
            .update(schema_1.Profile)
            .set({ skills, description, hourly_rate })
            .where((0, drizzle_orm_1.eq)(schema_1.Profile.id, id))
            .returning({
            id: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
        });
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
}));
router.get("/profiles/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const profiles = yield db_1.db
            .select({
            profileId: schema_1.Profile.id,
            userId: schema_1.Profile.user_id,
            skills: schema_1.Profile.skills,
            description: schema_1.Profile.description,
            hourlyRate: schema_1.Profile.hourly_rate,
            username: schema_1.User.username,
            userType: schema_1.User.user_type,
        })
            .from(schema_1.Profile)
            .leftJoin(schema_1.User, (0, drizzle_orm_1.eq)(schema_1.Profile.user_id, schema_1.User.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.User.user_type, "freelancer"), (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.User.username, `%${query}%`))));
        res.status(200).json(profiles);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to search profiles" });
    }
}));
exports.default = router;
