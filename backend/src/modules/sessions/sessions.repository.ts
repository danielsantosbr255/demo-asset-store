import type { IDatabase } from "@/common/database/IDatabase";
import type { ISession } from "./session.dto";
import type { Session } from "./session.entity";

type GetManyResponse = {
	sessions: ISession[];
	totalItems: number;
};

type GetManyQuery = {
	where: Record<string, string>;
	limit: number;
	offset: number;
};

export class SessionsRepository {
	private readonly table = "sessions";

	constructor(private readonly db: IDatabase) {}

	async create(session: Session): Promise<ISession> {
		return await this.db.table<ISession>(this.table).create({
			data: session,
		});
	}

	async getById(id: string): Promise<ISession | null> {
		return await this.db.table<ISession>(this.table).findUnique({
			where: { id },
		});
	}

	async getByUserId(user_id: string): Promise<ISession[]> {
		return await this.db.table<ISession>(this.table).findMany({ where: { user_id } });
	}

	async getMany(args: GetManyQuery): Promise<GetManyResponse> {
		const [sessions, totalItems] = await Promise.all([
			this.db.table<ISession>(this.table).findMany({
				where: args.where,
				limit: args.limit,
				offset: args.offset,
			}),
			this.db.table<ISession>(this.table).count({ where: args.where }),
		]);

		return { sessions, totalItems };
	}

	async update(id: string, session: Session): Promise<ISession> {
		return await this.db.table<ISession>(this.table).update({
			where: { id },
			data: session,
		});
	}

	async delete(id: string): Promise<void> {
		await this.db.table<ISession>(this.table).delete({ where: { id } });
	}

	async deleteByUserId(id: string, user_id: string): Promise<void> {
		await this.db.table<ISession>(this.table).delete({ where: { id, user_id } });
	}
}
