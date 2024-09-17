import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import { db } from "./drizzle/db";
import { User } from "./drizzle/schema";

const app: Application = express();

const envPath = path.resolve(__dirname, "../config/.env");
dotenv.config({ path: envPath });

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function main() {
  await db.insert(User).values({
    name: "Valentin",
  });
  const user = await db.query.User.findFirst();
  console.log(user);
}

main();

export default app;
