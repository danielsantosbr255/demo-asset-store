import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { config } from "@/core/config";
import { HttpError } from "@/core/errors/HttpError";
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
		logger.error("Status:", err instanceof HttpError ? err.statusCode : 500);
		logger.error("Message:", err.message);
		logger.error("Stack trace:", formatStackTrace(err.stack));
	}

	if (err instanceof HttpError) {
		res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
		next();
		return;
	}

	if (err instanceof z.ZodError) {
		const message = err.issues[0].message;
		res.status(400).json({ message, statusCode: 400 });
		next();
		return;
	}

	res.status(500).json({ message: err.message, statusCode: 500 });

	next();
};
