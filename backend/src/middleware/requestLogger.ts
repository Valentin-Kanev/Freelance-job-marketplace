import { Request, Response, NextFunction } from "express";
import { getLoggerWithContext } from "./logger";

let requestSerial = 1;

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  let requestId = req.headers["x-request-id"];
  if (!requestId) {
    requestId = requestSerial.toString();
    requestSerial++;
  }

  const userId = (req as any).user?.id;
  req.logger = getLoggerWithContext({ requestId, userId });
  res.setHeader("x-request-id", requestId);
  next();
}
