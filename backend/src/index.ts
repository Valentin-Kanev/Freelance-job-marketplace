import express, { Application } from "express";
import http from "http"; // Required for integrating Socket.IO with Express
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import userManagmentRouter from "./routes/userManagment";
import profilesRouter from "./routes/profiles";
import jobsRouter from "./routes/jobs";
import applicationsRouter from "./routes/applications";
import reviewsRouter from "./routes/reviews";
import chatRouter from "./routes/chat";
import { initializeSocket } from "./socket.io/socket";

const app: Application = express();
const server = http.createServer(app); // Create a server instance for Socket.IO

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));

const envPath = path.resolve(__dirname, "../config/.env");
dotenv.config({ path: envPath });

app.use(express.json());
app.use(userManagmentRouter);
app.use("/applications", applicationsRouter);
app.use(profilesRouter);
app.use("/reviews", reviewsRouter);
app.use("/profiles", reviewsRouter);
app.use(jobsRouter);
app.use(chatRouter);

// Initialize Socket.IO
const io = initializeSocket(server);

const PORT: string | number = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
