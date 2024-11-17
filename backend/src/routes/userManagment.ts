import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, or } from "drizzle-orm/expressions";
import { Profile, User } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import * as path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";
import authenticateToken from "../middleware/Authentication/authenticateToken";

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

  if (!username || !password || !email || !user_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the username or email already exists
    const existingUsers = await db
      .select()
      .from(User)
      .where(or(eq(User.username, username), eq(User.email, email)))
      .execute();

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // If not, proceed to insert a new user
    const newUser = await db
      .insert(User)
      .values({
        username,
        password,
        email,
        user_type,
      })
      .returning();

    // Automatically create a blank profile for the new user
    await db.insert(Profile).values({
      user_id: newUser[0].id, // Use the newly created user's ID
      skills: "",
      description: "",
      hourly_rate: "0.00", // Set default hourly rate to 0.00
    });

    res.status(201).json({
      message: "User registered and profile created successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
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

    // Check if the user has a profile, create one if not
    const existingProfile = await db
      .select()
      .from(Profile)
      .where(eq(Profile.user_id, user.id))
      .execute();

    if (existingProfile.length === 0) {
      // Create a blank profile for the user if they don't have one
      await db.insert(Profile).values({
        user_id: user.id,
        skills: "",
        description: "",
        hourly_rate: "0.00",
      });
    }

    // Create JWT token
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, user_type: user.user_type },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user.id }); // Include userId in the response
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
