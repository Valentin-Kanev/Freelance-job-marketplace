import { Server } from "socket.io";
import { db } from "../drizzle/db";
import { Message } from "../drizzle/schema";
import authenticateSocket from "../middleware/Authentication/authenticateSocket";
import { Server as HttpServer } from "http";
import { logger } from "../middleware/logger";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.on("joinRoom", (chatRoom_id) => {
      socket.join(chatRoom_id);
    });

    socket.on("sendMessage", async ({ chatRoom_id, senderId, content }) => {
      try {
        const message = await db
          .insert(Message)
          .values({ chatRoom_id, sender_id: senderId, content })
          .returning()
          .then((messages) => messages[0]);

        io.to(chatRoom_id).emit("receiveMessage", message);
      } catch (error) {
        logger.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
