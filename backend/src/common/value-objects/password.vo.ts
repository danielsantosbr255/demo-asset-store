import argon from "argon2";
import { HttpError } from "@/core/errors/HttpError";

export class Password {
	private constructor(public readonly hashed: string) {}

	static async create(raw: string): Promise<Password> {
		if (raw.length < 6) throw HttpError.BadRequest("Password too short");

		const hashed = await argon.hash(raw, { type: argon.argon2id });
		return new Password(hashed);
	}

	static restore(hashed: string): Password {
		return new Password(hashed);
	}

	static async compare(hashed: string, raw: string): Promise<boolean> {
		return await argon.verify(hashed, raw);
	}
}
