import { config } from "@/core/config";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import { logger } from "../utils/logger.util";

const formatStackTrace = (stack: string | undefined) => {
  if (!stack) return "No stack trace available.";
  return stack
    .split("\n")
    .filter((line) => line.includes("at ") && !line.includes("node_modules"))
    .map((line) => `${line.trim()}`)
    .join("\n[.....] ");
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (config.env !== "production") {
    logger.error(`Path Request: ${req.method} ${req.originalUrl}`);
    logger.error("Status:", err instanceof CustomError ? err.statusCode : 500);
    logger.error("Message:", err.message);
    logger.error("Stack trace:", formatStackTrace(err.stack));
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
    next();
    return;
  }

  res.status(500).json({ message: err.message, statusCode: 500 });

  next();
};
