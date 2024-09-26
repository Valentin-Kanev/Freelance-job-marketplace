import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import userManagmentRouter from "./routes/userManagment";
import profilesRouter from "./routes/profiles";
import jobsRouter from "./routes/jobs";
import applicationsRouter from "./routes/applications";
import reviewsRouter from "./routes/reviews";

const app: Application = express();

const envPath = path.resolve(__dirname, "../config/.env");
dotenv.config({ path: envPath });

app.use(express.json());
app.use(userManagmentRouter);
app.use(applicationsRouter);
app.use(profilesRouter);
app.use(reviewsRouter);
app.use(jobsRouter);

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
