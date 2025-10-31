import { BaseError } from "./BaseError";

export class HttpError extends BaseError {
	constructor(message: string, statusCode: number) {
		super(message, statusCode, true);
	}

	static BadRequest(msg = "Bad Request") {
		return new HttpError(msg, 400);
	}

	static Unauthorized(msg = "Unauthorized") {
		return new HttpError(msg, 401);
	}

	static Forbidden(msg = "Forbidden") {
		return new HttpError(msg, 403);
	}

	static NotFound(msg = "Not Found") {
		return new HttpError(msg, 404);
	}

	static Conflict(msg = "Conflict") {
		return new HttpError(msg, 409);
	}

	static InternalServerError(msg = "Internal Server Error") {
		return new HttpError(msg, 500);
	}
}
