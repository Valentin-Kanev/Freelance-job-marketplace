import { Server } from "socket.io";
import { db } from "../drizzle/db";
import { Message } from "../drizzle/schema";
import authenticateSocket from "../middleware/Authentication/authenticateSocket";
import { Server as HttpServer } from "http";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ roomId, senderId, content }) => {
      try {
        const message = await db
          .insert(Message)
          .values({ chat_room_id: roomId, sender_id: senderId, content })
          .returning()
          .then((messages) => messages[0]);

        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
