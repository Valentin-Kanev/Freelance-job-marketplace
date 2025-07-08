import type { getLoggerWithContext } from "../middleware/logger";

declare module "express-serve-static-core" {
  interface Request {
    user: JwtPayload;
    logger: ReturnType<typeof getLoggerWithContext>;
  }
}
