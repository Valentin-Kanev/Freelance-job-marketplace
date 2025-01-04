import { Server } from "socket.io";
import { db } from "../drizzle/db";
import { Message } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import authenticateSocket from "../middleware/Authentication/authenticateSocket";

import { Server as HttpServer } from "http";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001", // Update to your frontend URL
      methods: ["GET", "POST"],
    },
  });

  // Use authentication middleware
  io.use(authenticateSocket);

  // Define Socket.IO events
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, senderId, content }) => {
      console.log(
        `Message received from ${senderId} in room ${roomId}: ${content}`
      );
      try {
        const message = await db
          .insert(Message)
          .values({ chat_room_id: roomId, sender_id: senderId, content })
          .returning()
          .then((messages) => messages[0]);

        // Broadcast the message to the room
        io.to(roomId).emit("receiveMessage", message);
        console.log(
          `Message broadcasted to room ${roomId}: ${message.content}`
        );
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
