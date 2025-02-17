import express, { Request, Response } from "express";
import { eq, or } from "drizzle-orm/expressions";
import { Profile, User } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import * as path from "path";
import dotenv from "dotenv";

const router = express.Router();
const envPath = path.resolve(__dirname, "../../config/.env");
dotenv.config({ path: envPath });

const SECRET_KEY = process.env.SECRET_KEY as string;

router.post("/register", async (req: Request, res: Response) => {
  const { username, password, email, user_type } = req.body;

  //use zod to validate the data

  if (!username || !password || !email || !user_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //This is fixed
    const existingUser = await db.query.User.findFirst({
      where: or(eq(User.username, username), eq(User.email, email)),
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = await db
      .insert(User)
      .values({ username, password, email, user_type })
      .returning();

    await db.insert(Profile).values({
      user_id: newUser[0].id,
      skills: "",
      description: "",
      hourly_rate: "0.00",
    });

    res.status(201).json({
      message: "User registered and profile created successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      res.status(500).json({ message: "Server error", error: String(error) });
    }
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .execute();

    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await db
      .select({
        isValid: sql`crypt(${password}, ${user.password}) = ${user.password}`,
      })
      .from(User)
      .where(eq(User.email, email))
      .execute();

    if (!isValidPassword[0]?.isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const existingProfile = await db
      .select()
      .from(Profile)
      .where(eq(Profile.user_id, user.id))
      .execute();

    if (existingProfile.length === 0) {
      await db.insert(Profile).values({
        user_id: user.id,
        skills: "",
        description: "",
        hourly_rate: "0.00",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, user_type: user.user_type },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
