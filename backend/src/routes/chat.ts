import { Router } from "express";
import { db } from "../drizzle/db";
import { ChatRoom, Message, User } from "../drizzle/schema";
import { eq, and, or, asc } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";
import authenticateToken from "../middleware/Authentication/authenticateToken";

const chatRouter = Router();

chatRouter.get("/chat-rooms", authenticateToken, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  if (!userId) {
    console.error("Unauthorized access");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chatRooms = await db
      .select()
      .from(ChatRoom)
      .where(
        or(eq(ChatRoom.user_1_id, userId), eq(ChatRoom.user_2_id, userId))
      );

    const chatRoomsWithDetails = await Promise.all(
      chatRooms.map(async (room) => {
        const otherUserId =
          room.user_1_id === userId ? room.user_2_id : room.user_1_id;
        const otherUser = await db
          .select()
          .from(User)
          .where(eq(User.id, otherUserId))
          .then((users) => users[0]);
        return {
          ...room,
          otherUser: { id: otherUser.id, username: otherUser.username },
        };
      })
    );

    res.json(chatRoomsWithDetails);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch chat rooms." });
  }
});

chatRouter.get(
  "/chat-rooms/:id/messages",
  authenticateToken,
  async (req, res) => {
    const { id: chat_room_id } = req.params;

    try {
      const messages = await db
        .select()
        .from(Message)
        .where(eq(Message.chat_room_id, chat_room_id))
        .orderBy(asc(Message.created_at));

      const messagesWithUsernames = await Promise.all(
        messages.map(async (message) => {
          const sender = await db
            .select()
            .from(User)
            .where(eq(User.id, message.sender_id))
            .then((users) => users[0]);
          return {
            ...message,
            sender_username: sender.username,
            timestamp: message.created_at.toISOString(),
          };
        })
      );

      res.json(messagesWithUsernames);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  }
);

chatRouter.post("/chat-rooms", authenticateToken, async (req, res) => {
  const { user_1_id, user_2_id } = req.body;

  try {
    if (!user_1_id || !user_2_id || user_1_id === user_2_id) {
      console.error("Invalid user IDs");
      return res.status(400).json({ error: "Invalid user IDs provided." });
    }

    const existingRoom = await db
      .select()
      .from(ChatRoom)
      .where(
        or(
          and(
            eq(ChatRoom.user_1_id, user_1_id),
            eq(ChatRoom.user_2_id, user_2_id)
          ),
          and(
            eq(ChatRoom.user_1_id, user_2_id),
            eq(ChatRoom.user_2_id, user_1_id)
          )
        )
      )
      .then((rooms) => rooms[0]);

    if (existingRoom) {
      return res.json({ chat_room_id: existingRoom.id });
    }

    const newRoom = await db
      .insert(ChatRoom)
      .values({ user_1_id, user_2_id })
      .returning()
      .then((rooms) => rooms[0]);

    res.json({ chat_room_id: newRoom.id });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error creating chat room:", errorMessage, errorStack);
    res.status(500).json({ error: "Failed to create or retrieve chat room." });
  }
});

chatRouter.post(
  "/chat-rooms/:id/messages",
  authenticateToken,
  async (req, res) => {
    const { id: chat_room_id } = req.params;
    const { sender_id, content } = req.body;
    const userId = (req.user as JwtPayload)?.id;

    try {
      if (!content || content.trim() === "") {
        console.error("Message content cannot be empty");
        return res
          .status(400)
          .json({ error: "Message content cannot be empty." });
      }

      const chatRoom = await db
        .select()
        .from(ChatRoom)
        .where(eq(ChatRoom.id, chat_room_id))
        .then((rooms) => rooms[0]);

      if (
        !chatRoom ||
        (chatRoom.user_1_id !== userId && chatRoom.user_2_id !== userId)
      ) {
        console.error("User not authorized to send messages in this chat room");
        return res.status(403).json({
          error: "User not authorized to send messages in this chat room.",
        });
      }

      const message = await db
        .insert(Message)
        .values({ chat_room_id, sender_id, content })
        .returning()
        .then((messages) => messages[0]);

      console.log("Message sent successfully:", message);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  }
);

export default chatRouter;
