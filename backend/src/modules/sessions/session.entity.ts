import { add, isBefore, isValid } from "date-fns";
import { v7 as uuidv7 } from "uuid";
import { HttpError } from "@/core/errors/HttpError";
import type { CreateSessionDTO, ISession } from "./session.dto";

export class Session {
	static readonly DEFAULT_TTL = { days: 1 };

	private constructor(
		public readonly id: string,
		public readonly user_id: string,
		public readonly user_agent: string,
		public readonly ip: string,
		public readonly created_at: Date,
		public updated_at: Date,
		public expires_at: Date,
	) {}

	static create(data: CreateSessionDTO): Session {
		const now = Session.utcNow();

		if (!data.user_id) {
			throw HttpError.BadRequest("user_id is required to create a session.");
		}

		const id = data.id ?? uuidv7();
		const created_at = now;
		const updated_at = now;
		const expires_at = data.expires_at ?? add(created_at, Session.DEFAULT_TTL);

		Session.ensureValidDate(created_at, "created_at");
		Session.ensureValidDate(expires_at, "expires_at");

		if (isBefore(expires_at, created_at)) {
			throw HttpError.BadRequest("expires_at must be after created_at.");
		}

		if (isBefore(expires_at, now)) {
			throw HttpError.BadRequest("Session expires_at must be in the future.");
		}

		return new Session(id, data.user_id, data.user_agent, data.ip, created_at, updated_at, expires_at);
	}

	static restore(data: ISession): Session {
		const { id, user_id, user_agent, ip, created_at, updated_at, expires_at } = data;
		return new Session(id, user_id, user_agent, ip, created_at, updated_at, expires_at);
	}

	public isExpired(): boolean {
		return isBefore(this.expires_at, Session.utcNow());
	}

	private static ensureValidDate(value: Date, field: string): void {
		if (!isValid(value)) {
			throw HttpError.BadRequest(`${field} must be a valid Date.`);
		}
	}

	private static utcNow(): Date {
		return new Date(Date.now());
	}
}
