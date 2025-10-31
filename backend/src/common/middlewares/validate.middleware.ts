import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export const validate = (schema: z.ZodType) => (req: Request, _: Response, next: NextFunction) => {
	const data = schema.parse(req.body);

	req.body = data;

	next();
};
