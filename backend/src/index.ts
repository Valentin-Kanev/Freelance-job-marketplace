import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import userManagmentRouter from "./routes/userManagment";
import profilesRouter from "./routes/profiles";
import jobsRouter from "./routes/jobs";
import applicationsRouter from "./routes/applications";
import reviewsRouter from "./routes/reviews";
import cors from "cors";

const app: Application = express();

// CORS options
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));

// Load environment variables
const envPath = path.resolve(__dirname, "../config/.env");
dotenv.config({ path: envPath });

// Middleware
app.use(express.json());
app.use(userManagmentRouter);
app.use("/applications", applicationsRouter);
app.use(profilesRouter);
app.use("/reviews", reviewsRouter);
app.use("/profiles", reviewsRouter);
app.use(jobsRouter);

// Start server
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
