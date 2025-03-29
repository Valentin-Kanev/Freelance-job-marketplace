import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
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

  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not set in the environment");
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    SECRET_KEY,
    async (
      err: VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
        return res.status(400).json({ message: "Invalid token payload" });
      }

      try {
        const user = await db.query.User.findFirst({
          where: eq(User.user_id, (decoded as JwtPayload).id),
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
      } catch (dbError) {
        return res.status(500).json({ message: "Error fetching user data" });
      }
    }
  );
};

export default authenticateToken;
