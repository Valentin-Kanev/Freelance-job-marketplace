import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { ChatRoom, Message, User } from "../drizzle/schema";
import { eq, and, or, asc } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";
import authenticateToken from "../middleware/Authentication/authenticateToken";
import { validate } from "../middleware/validate";
import {
  createMessageSchema,
  CreateMessageValidation,
} from "../schemas/ChatValidationSchema";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { logger } from "../middleware/logger";

const chatRouter = Router();

chatRouter.get(
  "/chat-rooms",
  authenticateToken,
  async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload)?.userId;

    try {
      const chatRooms = await db
        .select()
        .from(ChatRoom)
        .where(
          or(eq(ChatRoom.userOneId, userId), eq(ChatRoom.userTwoId, userId))
        );

      const chatRoomsWithDetails = await Promise.all(
        chatRooms.map(async (room) => {
          const otherUserId =
            room.userOneId === userId ? room.userTwoId : room.userOneId;

          const otherUser = await db.query.User.findFirst({
            where: eq(User.userId, otherUserId),
          });

          return {
            ...room,
            otherUser: {
              id: otherUser?.userId,
              username: otherUser?.username,
            },
          };
        })
      );

      res.json(chatRoomsWithDetails);
    } catch (error) {
      logger.error("Error fetching chat rooms:", error);
      res.status(500).json({ error: "Failed to fetch chat rooms." });
    }
  }
);

chatRouter.get(
  "/chat-rooms/:id/messages",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id: chatRoomId } = req.params;

    try {
      const messages = await db
        .select()
        .from(Message)
        .where(eq(Message.chatRoomId, chatRoomId))
        .orderBy(asc(Message.createdAt));

      const messagesWithUsernames = await Promise.all(
        messages.map(async (message) => {
          const sender = await db.query.User.findFirst({
            where: eq(User.userId, message.senderId),
          });

          return {
            ...message,
            senderUsername: sender?.username,
            timestamp: message.createdAt.toISOString(),
          };
        })
      );

      res.json(messagesWithUsernames);
    } catch (error) {
      logger.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  }
);

chatRouter.post(
  "/chat-rooms",
  authenticateToken,
  async (req: Request, res: Response) => {
    const userOneId = req.user.userId;
    const { userTwoId } = req.body;

    try {
      const existingRoom = await db.query.ChatRoom.findFirst({
        where: or(
          and(
            eq(ChatRoom.userOneId, userOneId),
            eq(ChatRoom.userTwoId, userTwoId)
          ),
          and(
            eq(ChatRoom.userOneId, userTwoId),
            eq(ChatRoom.userTwoId, userOneId)
          )
        ),
      });

      if (existingRoom) {
        res.json({ chatRoomId: existingRoom.chatRoomId });
        return;
      }

      const newRoom = await db
        .insert(ChatRoom)
        .values({ userOneId, userTwoId })
        .returning()
        .then((rooms) => rooms[0]);

      res.json({ chatRoomId: newRoom.chatRoomId });
    } catch (error) {
      logger.error("Error creating chat room:", error);
      res
        .status(500)
        .json({ error: "Failed to create or retrieve chat room." });
    }
  }
);

chatRouter.post(
  "/chat-rooms/:id/messages",
  validate(createMessageSchema),
  authenticateToken,
  async (req: AuthenticatedRequest<CreateMessageValidation>, res: Response) => {
    const { id: chatRoomId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    const senderId = req.user.userId;

    try {
      const chatRoom = await db.query.ChatRoom.findFirst({
        where: and(
          eq(ChatRoom.chatRoomId, chatRoomId),
          or(eq(ChatRoom.userOneId, userId), eq(ChatRoom.userTwoId, userId))
        ),
      });

      if (!chatRoom) {
        logger.error("User not authorized to send messages in this chat room");
        res.status(403).json({
          error: "User not authorized to send messages in this chat room.",
        });
        return;
      }

      const message = await db
        .insert(Message)
        .values({ chatRoomId, senderId, content })
        .returning()
        .then((messages) => messages[0]);

      res.json(message);
    } catch (error) {
      logger.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  }
);

export default chatRouter;
