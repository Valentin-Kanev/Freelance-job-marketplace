import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { User } from "../../drizzle/schema";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not set in the environment");
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const user = await db
        .select()
        .from(User)
        .where(eq(User.id, decoded.id))
        .execute();

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user[0];
      next();
    } catch (dbError) {
      console.error(dbError);
      return res.status(500).json({ message: "Error fetching user data" });
    }
  });
};

export default authenticateToken;
