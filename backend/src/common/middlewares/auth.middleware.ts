import type { NextFunction, Request, Response } from "express";
import { HttpError } from "@/core/errors/HttpError";
import { SessionsService } from "@/modules/sessions/sessions.service";
import { getDb } from "../database";

export const AuthGuard = async (req: Request, _: Response, next: NextFunction) => {
	const sessionId = req.cookies.sessionId;
	const sessionService = new SessionsService(getDb());

	const session = await sessionService.getById(sessionId);

	if (!session) throw HttpError.Unauthorized();
	if (session.isExpired()) throw HttpError.Unauthorized();

	req.session = session;
	req.user_id = session.user_id;

	// const user_agent = req.headers['user-agent'] ?? 'Desconhecido';
	// const ua = getUserAgent(user_agent);

	// if (ua.browser !== req.session.browser) {
	//   console.error('❌ Context not match.');
	//   throw new HttpError.Unauthorized();
	// }

	next();
};
