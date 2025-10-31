import type { Request, Response } from "express";
import { getClientIp } from "@/common/utils/getClientIp.util";
import { validateData } from "@/common/utils/validateData.util";
import { config } from "@/core/config";
import { createSessionSchema } from "../sessions/session.dto";
import type { SessionsService } from "../sessions/sessions.service";
import { signInSchema, signOutSchema, signUpSchema } from "./auth.dto";
import type { AuthService } from "./auth.service";

export class AuthController {
	constructor(
		private readonly service: AuthService,
		private readonly sessionsService: SessionsService,
	) {}

	signUp = async (req: Request, res: Response) => {
		const { name, email, password } = validateData(req.body, signUpSchema);
		const createdUser = await this.service.signUp({ name, email, password });

		res.status(201).json({
			message: "User created successfuly!",
			data: createdUser,
		});
	};

	signIn = async (req: Request, res: Response) => {
		const { email, password } = validateData(req.body, signInSchema);
		const userLogged = await this.service.signIn({ email, password });

		const user_agent = req.headers["user-agent"] ?? "Desconhecido";
		const user_id = userLogged.id;
		const ip = getClientIp(req);

		const parsedSession = validateData({ user_id, user_agent, ip }, createSessionSchema);
		const createdSession = await this.sessionsService.create(parsedSession);

		res.cookie("sessionId", createdSession.id, {
			httpOnly: true,
			secure: config.env === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({
			message: "User logged successfuly!",
			data: createdSession,
		});
	};

	signOut = async (req: Request, res: Response) => {
		const user_id = req.user_id ?? "";
		const session_id = req.cookies.sessionId;

		const parsedData = validateData({ session_id, user_id }, signOutSchema);
		await this.sessionsService.deleteByUserId(parsedData.session_id, parsedData.user_id);

		res.clearCookie("sessionId");

		res.json({
			message: "User logged out successfuly!",
			data: parsedData,
		});
	};
}
