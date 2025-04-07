import express, { Request, Response } from "express";
import { eq, or } from "drizzle-orm/expressions";
import { Profile, User } from "../drizzle/schema";
import { db } from "../drizzle/db";
import jwt from "jsonwebtoken";
import * as path from "path";
import dotenv from "dotenv";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  CreateUserValidation,
  loginSchema,
  LoginValidation,
} from "../schemas/userManagmentValidationScheema";
import bcrypt from "bcrypt";
import { logger } from "../middleware/logger";
import { sql } from "drizzle-orm";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { CustomResponse } from "../types/responseType";

const router = express.Router();
const envPath = path.resolve(__dirname, "../../config/.env");
dotenv.config({ path: envPath });

const SECRET_KEY = process.env.SECRET_KEY as string;

router.post(
  "/register",
  validate(createUserSchema),
  async (
    req: AuthenticatedRequest<CreateUserValidation>,
    res: Response<CustomResponse<CreateUserValidation>>
  ) => {
    const { username, password, email, user_type } =
      req.body as CreateUserValidation;

    try {
      const existingUser = await db.query.User.findFirst({
        where: or(eq(User.username, username), eq(User.email, email)),
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await db
        .insert(User)
        .values({ username, password: hashedPassword, email, user_type })
        .returning();

      await db.insert(Profile).values({
        user_id: newUser[0].user_id,
        skills: "",
        description: "",
        hourly_rate: user_type === "freelancer" ? sql`0` : null,
      });

      res.status(201).json({
        message: "User registered and profile created successfully",
        data: newUser[0],
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: String(error) });
    }
  }
);

router.post(
  "/login",
  validate(loginSchema),
  async (req: AuthenticatedRequest<LoginValidation>, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await db.query.User.findFirst({
        where: eq(User.email, email),
        columns: {
          user_id: true,
          username: true,
          user_type: true,
          password: true,
        },
      });

      if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (!SECRET_KEY) {
        logger.error("SECRET_KEY is not defined in environment variables.");
        return res.status(500).json({ message: "Internal server error" });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          user_type: user.user_type,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({ message: "Login successful", token, userId: user.user_id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
