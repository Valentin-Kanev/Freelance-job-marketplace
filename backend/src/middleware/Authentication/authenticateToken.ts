import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { User } from "../../drizzle/schema";
import { logger } from "../logger";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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
    res.status(401).json({ message: "No token provided" });
    return;
  }
  jwt.verify(
    token,
    SECRET_KEY,
    (
      err: VerifyErrors | null,
      decodedToken: string | JwtPayload | undefined
    ) => {
      if (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
      }
      if (
        typeof decodedToken !== "object" ||
        !decodedToken ||
        !("id" in decodedToken)
      ) {
        res.status(400).json({ message: "Invalid token payload" });
        return;
      }
      (async () => {
        try {
          const user = await db.query.User.findFirst({
            where: eq(User.userId, (decodedToken as JwtPayload).id),
          });
          if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
          }
          req.user = { ...(decodedToken as JwtPayload), ...user };
          logger.info(
            { username: user.username, userId: user.userId },
            "Authenticated user:"
          );
          next();
        } catch (dbError) {
          logger.error("Database error:", dbError);
          res.status(500).json({ message: "Error fetching user data" });
        }
      })();
    }
  );
};

export default authenticateToken;
