import { HttpError } from "@/core/errors/HttpError";

export class Email {
	private constructor(public readonly value: string) {}

	static create(value: string): Email {
		if (!Email.isValid(value)) {
			throw HttpError.BadRequest("Email inválido.");
		}
		return new Email(value.toLowerCase().trim());
	}

	static isValid(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}
}
