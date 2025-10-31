import type { Request, Response } from "express";

export class AppController {
	getHello(_: Request, res: Response) {
		return res.status(200).json({ message: "Hello World!" });
	}
}
