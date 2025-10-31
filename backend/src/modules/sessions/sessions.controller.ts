import type { Request, Response } from "express";
import { getClientIp } from "@/common/utils/getClientIp.util";
import { HttpError } from "@/core/errors/HttpError";
import type { SessionsService } from "./sessions.service";

export class SessionsController {
	constructor(private readonly service: SessionsService) {}

	create = async (req: Request, res: Response) => {
		const user_id = req.user_id;
		if (!user_id) throw HttpError.BadRequest("User ID is required!");

		const user_agent = req.headers["user-agent"] ?? "Desconhecido";
		const ip = getClientIp(req);

		const createdSession = await this.service.create({ user_id, user_agent, ip });
		res.json({ message: "Session created successfuly!", data: createdSession });
	};

	getMany = async (req: Request, res: Response) => {
		const result = await this.service.getMany(req.query);

		res.json({
			message: "Sessions",
			data: result.sessions,
			metadata: result.metadata,
		});
	};

	getById = async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		if (!id) throw HttpError.BadRequest("Session ID is required!");

		const session = await this.service.getById(id);
		res.json({ message: "Session", data: session });
	};

	delete = async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		if (!id) throw HttpError.BadRequest("Session ID is required!");

		await this.service.delete(id);
		res.json({ message: "Session deleted successfuly!" });
	};
}
