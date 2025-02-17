"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const expressions_1 = require("drizzle-orm/expressions");
const schema_1 = require("../drizzle/schema");
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = express_1.default.Router();
const envPath = path.resolve(__dirname, "../../config/.env");
dotenv_1.default.config({ path: envPath });
const SECRET_KEY = process.env.SECRET_KEY;
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, user_type } = req.body;
    //use zod to validate the data
    if (!username || !password || !email || !user_type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        //This is fixed
        const existingUser = yield db_1.db.query.User.findFirst({
            where: (0, expressions_1.or)((0, expressions_1.eq)(schema_1.User.username, username), (0, expressions_1.eq)(schema_1.User.email, email)),
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username or email already exists" });
        }
        const newUser = yield db_1.db
            .insert(schema_1.User)
            .values({ username, password, email, user_type })
            .returning();
        yield db_1.db.insert(schema_1.Profile).values({
            user_id: newUser[0].id,
            skills: "",
            description: "",
            hourly_rate: "0.00",
        });
        res.status(201).json({
            message: "User registered and profile created successfully",
            user: newUser,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
        else {
            res.status(500).json({ message: "Server error", error: String(error) });
        }
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const users = yield db_1.db
            .select()
            .from(schema_1.User)
            .where((0, expressions_1.eq)(schema_1.User.email, email))
            .execute();
        const user = users[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isValidPassword = yield db_1.db
            .select({
            isValid: (0, drizzle_orm_1.sql) `crypt(${password}, ${user.password}) = ${user.password}`,
        })
            .from(schema_1.User)
            .where((0, expressions_1.eq)(schema_1.User.email, email))
            .execute();
        if (!((_a = isValidPassword[0]) === null || _a === void 0 ? void 0 : _a.isValid)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const existingProfile = yield db_1.db
            .select()
            .from(schema_1.Profile)
            .where((0, expressions_1.eq)(schema_1.Profile.user_id, user.id))
            .execute();
        if (existingProfile.length === 0) {
            yield db_1.db.insert(schema_1.Profile).values({
                user_id: user.id,
                skills: "",
                description: "",
                hourly_rate: "0.00",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, user_type: user.user_type }, SECRET_KEY, { expiresIn: "1h" });
        res
            .status(200)
            .json({ message: "Login successful", token, userId: user.id });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
exports.default = router;
