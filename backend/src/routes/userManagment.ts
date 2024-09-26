import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm/expressions";
import { User } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import * as path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../config/.env");
dotenv.config({ path: envPath });

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY || "secret";

// Initialize PostgreSQL pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Drizzle instance using the PostgreSQL client
const db = drizzle(pool);

// POST /register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, email, user_type } = req.body;

  // Validate input
  if (!username || !password || !email || !user_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Insert new user into the database
    const user = await db
      .insert(User)
      .values({
        username,
        password,
        email,
        user_type,
      })
      .returning();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    console.error("Error registering user:", error); // Log error to the console
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .execute();

    const user = users[0]; // Get the first user from the results

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password using PostgreSQL's crypt function
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

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, user_type: user.user_type },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
