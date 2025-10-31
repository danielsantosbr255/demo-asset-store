import type { Request, Response } from "express";
import { HttpError } from "@/core/errors/HttpError";
import type UserService from "./users.service";

export default class UserController {
	constructor(private readonly service: UserService) {}

	create = async (req: Request, res: Response) => {
		const createdUser = await this.service.create(req.body);
		res.status(201).json({ message: "User created successfuly!", data: createdUser });
	};

	getMany = async (req: Request, res: Response) => {
		const result = await this.service.getMany(req.query);

		res.json({
			message: "Users",
			data: result.users,
			metadata: result.metadata,
		});
	};

	getById = async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		if (!id) throw HttpError.BadRequest("User ID is required!");

		const user = await this.service.getById(id);
		res.json({ message: "User", data: user });
	};

	update = async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };

		const updatedUser = await this.service.update(id, req.body);
		res.json({ message: "User updated successfuly!", data: updatedUser });
	};

	delete = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw HttpError.BadRequest("User ID is required!");

		await this.service.delete(id);
		res.json({ message: "User deleted successfuly!", data: id });
	};
}
