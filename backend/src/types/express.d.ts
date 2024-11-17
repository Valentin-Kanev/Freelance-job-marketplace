// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; // or use a custom user type if you have one
  }
}
