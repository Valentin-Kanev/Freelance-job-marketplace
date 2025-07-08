import { Request, Response, NextFunction } from "express";
import { getLoggerWithContext } from "./logger";

// Simple serial counter for request IDs
let requestSerial = 1;

// Middleware to attach a contextual logger to each request
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Generate or reuse a serial requestId
  let requestId = req.headers["x-request-id"];
  if (!requestId) {
    requestId = requestSerial.toString();
    requestSerial++;
  }

  // Optionally, extract userId if authenticated (adjust as needed)
  // This assumes req.user is set by your authentication middleware
  const userId = (req as any).user?.id;

  // Attach a child logger with context to the request
  req.logger = getLoggerWithContext({ requestId, userId });

  // Optionally, add requestId to response headers for tracing
  res.setHeader("x-request-id", requestId);

  next();
}

// Extend Express Request type to include logger
// Add this to your express.d.ts for type safety:
// declare global {
//   namespace Express {
//     interface Request {
//       logger: ReturnType<typeof getLoggerWithContext>;
//     }
//   }
// }
