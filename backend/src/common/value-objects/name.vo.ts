import { HttpError } from "@/core/errors/HttpError";

export class Name {
	private constructor(public readonly value: string) {}

	static create(value: string): Name {
		if (typeof value !== "string" || value.trim().length <= 3) {
			throw HttpError.BadRequest("Name must be at least 3 characters long.");
		}
		return new Name(value);
	}
}
