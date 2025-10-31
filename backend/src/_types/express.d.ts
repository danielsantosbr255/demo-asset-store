import type { ISession } from "@/modules/sessions/session.dto";
import "express";

declare global {
	namespace Express {
		interface Request {
			session: ISession;
			user_id?: string;
		}
	}
}
