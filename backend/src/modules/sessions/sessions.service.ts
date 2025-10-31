import type { PaginationMetadata, PaginationQueryParams } from "@/_types/pagination";
import { createPaginationMetadata, parsePaginationParams } from "@/common/utils/pagination.util";
import { HttpError } from "@/core/errors/HttpError";
import type { CreateSessionDTO, ISession } from "./session.dto";
import { Session } from "./session.entity";
import type { SessionsRepository } from "./sessions.repository";

type GetManyQuery = PaginationQueryParams;
type GetManyResponse = Promise<{
	sessions: ISession[];
	metadata: PaginationMetadata;
}>;

export class SessionsService {
	constructor(private readonly repository: SessionsRepository) {}

	async create(data: CreateSessionDTO): Promise<ISession> {
		const sessionEntity = Session.create(data);
		return await this.repository.create(sessionEntity);
	}

	async getMany(query: GetManyQuery): GetManyResponse {
		const where: Record<string, string> = {};
		const { page, pageSize, offset } = parsePaginationParams(query);

		const { sessions, totalItems } = await this.repository.getMany({
			where,
			offset,
			limit: pageSize,
		});

		const metadata = createPaginationMetadata({ page, pageSize, totalItems });

		return { sessions, metadata };
	}

	async getById(id: string): Promise<Session | null> {
		const session = await this.repository.getById(id);
		if (!session) return null;

		return Session.restore(session);
	}

	async getByUserId(user_id: string): Promise<ISession[]> {
		return await this.repository.getByUserId(user_id);
	}

	async delete(id: string): Promise<void> {
		const session = await this.repository.getById(id);
		if (!session) throw HttpError.NotFound("Session not found!");

		await this.repository.delete(id);
	}

	async deleteByUserId(id: string, user_id: string): Promise<void> {
		const session = await this.repository.getByUserId(user_id);
		if (!session) throw HttpError.NotFound("Session not found!");

		await this.repository.deleteByUserId(id, user_id);
	}
}
