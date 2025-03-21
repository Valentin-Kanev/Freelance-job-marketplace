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
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const authenticateSocket_1 = __importDefault(require("../middleware/Authentication/authenticateSocket"));
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"],
        },
    });
    io.use(authenticateSocket_1.default);
    io.on("connection", (socket) => {
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, senderId, content }) {
            try {
                const message = yield db_1.db
                    .insert(schema_1.Message)
                    .values({ chat_room_id: roomId, sender_id: senderId, content })
                    .returning()
                    .then((messages) => messages[0]);
                io.to(roomId).emit("receiveMessage", message);
            }
            catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message." });
            }
        }));
        socket.on("disconnect", () => { });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
