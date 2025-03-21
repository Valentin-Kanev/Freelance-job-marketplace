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
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const authenticateToken_1 = __importDefault(require("../middleware/Authentication/authenticateToken"));
const validate_1 = require("../middleware/validate");
const ChatValidationSchema_1 = require("../schemas/ChatValidationSchema");
const chatRouter = (0, express_1.Router)();
chatRouter.get("/chat-rooms", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const chatRooms = yield db_1.db
            .select()
            .from(schema_1.ChatRoom)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_1_id, userId), (0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_2_id, userId)));
        const chatRoomsWithDetails = yield Promise.all(chatRooms.map((room) => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserId = room.user_1_id === userId ? room.user_2_id : room.user_1_id;
            const otherUser = yield db_1.db.query.User.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.User.id, otherUserId),
            });
            return Object.assign(Object.assign({}, room), { otherUser: { id: otherUser === null || otherUser === void 0 ? void 0 : otherUser.id, username: otherUser === null || otherUser === void 0 ? void 0 : otherUser.username } });
        })));
        res.json(chatRoomsWithDetails);
    }
    catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ error: "Failed to fetch chat rooms." });
    }
}));
chatRouter.get("/chat-rooms/:id/messages", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: chat_room_id } = req.params;
    try {
        const messages = yield db_1.db
            .select()
            .from(schema_1.Message)
            .where((0, drizzle_orm_1.eq)(schema_1.Message.chat_room_id, chat_room_id))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.Message.created_at));
        const messagesWithUsernames = yield Promise.all(messages.map((message) => __awaiter(void 0, void 0, void 0, function* () {
            const sender = yield db_1.db.query.User.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.User.id, message.sender_id),
            });
            return Object.assign(Object.assign({}, message), { sender_username: sender === null || sender === void 0 ? void 0 : sender.username, timestamp: message.created_at.toISOString() });
        })));
        res.json(messagesWithUsernames);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages." });
    }
}));
chatRouter.post("/chat-rooms", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_1_id, user_2_id } = req.body;
    try {
        const existingRoom = yield db_1.db.query.ChatRoom.findFirst({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_1_id, user_1_id), (0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_2_id, user_2_id)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_1_id, user_2_id), (0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_2_id, user_1_id))),
        });
        if (existingRoom) {
            return res.json({ chat_room_id: existingRoom.id });
        }
        const newRoom = yield db_1.db
            .insert(schema_1.ChatRoom)
            .values({ user_1_id, user_2_id })
            .returning()
            .then((rooms) => rooms[0]);
        res.json({ chat_room_id: newRoom.id });
    }
    catch (error) {
        console.error("Error creating chat room:", error);
        res
            .status(500)
            .json({ error: "Failed to create or retrieve chat room." });
    }
}));
chatRouter.post("/chat-rooms/:id/messages", (0, validate_1.validate)(ChatValidationSchema_1.createMessageSchema), authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: chat_room_id } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id: sender_id } = req.user;
    try {
        const chatRoom = yield db_1.db.query.ChatRoom.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.ChatRoom.id, chat_room_id), (0, drizzle_orm_1.eq)(schema_1.ChatRoom.user_1_id, userId)),
        });
        if (!chatRoom) {
            console.error("User not authorized to send messages in this chat room");
            return res.status(403).json({
                error: "User not authorized to send messages in this chat room.",
            });
        }
        const message = yield db_1.db
            .insert(schema_1.Message)
            .values({ chat_room_id, sender_id, content })
            .returning()
            .then((messages) => messages[0]);
        res.json(message);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message." });
    }
}));
exports.default = chatRouter;
