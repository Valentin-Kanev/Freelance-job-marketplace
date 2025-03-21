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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error("SECRET_KEY is not set in the environment");
    }
    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ message: "No token provided" });
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error("Invalid or expired token:", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
            console.error("Decoded token is invalid");
            return res.status(400).json({ message: "Invalid token payload" });
        }
        try {
            const user = yield db_1.db.query.User.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.User.id, decoded.id),
            });
            if (!user) {
                console.error("User not found");
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next();
        }
        catch (dbError) {
            console.error("Error fetching user data:", dbError);
            return res.status(500).json({ message: "Error fetching user data" });
        }
    }));
});
exports.default = authenticateToken;
