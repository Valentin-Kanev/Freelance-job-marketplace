"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateSocket = (socket, next) => {
    var _a;
    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        const error = new Error("Authentication token is required.");
        console.error("Authentication token is required.");
        return next(error);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Socket authentication failed:", error.message);
        }
        else {
            console.error("Socket authentication failed:", error);
        }
        const authError = new Error("Authentication failed.");
        next(authError);
    }
};
exports.default = authenticateSocket;
