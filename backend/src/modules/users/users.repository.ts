import type { IDatabase } from "@/common/database/IDatabase";
import type { Email } from "@/common/value-objects/email.vo";
import type { IUser, UserResponseDTO } from "./user.dto";
import type { User } from "./user.entity";
import { UserMapper } from "./user.mapper";

type GetManyResponse = {
	users: UserResponseDTO[];
	totalItems: number;
};

type GetManyQuery = {
	where: Record<string, string>;
	limit: number;
	offset: number;
};

export class UsersRepository {
	private readonly table = "users";

	constructor(private readonly db: IDatabase) {}

	async create(user: User): Promise<UserResponseDTO> {
		const mappedUser = UserMapper.toDatabase(user);

		return this.db.table<IUser>(this.table).create({
			data: mappedUser,
			omit: ["password"],
		});
	}

	async getById(id: string): Promise<IUser | null> {
		const user = await this.db.table<IUser>(this.table).findUnique({
			where: { id },
			omit: ["password"],
		});
		return user;
	}

	async getMany(args: GetManyQuery): Promise<GetManyResponse> {
		const [users, totalItems] = await Promise.all([
			this.db.table<IUser, UserResponseDTO>(this.table).findMany({
				where: args.where,
				limit: args.limit,
				offset: args.offset,
				omit: ["password"],
			}),
			this.db.table<IUser>(this.table).count({ where: args.where }),
		]);

		return { users, totalItems };
	}

	async getByEmail(email: Email): Promise<IUser | null> {
		return await this.db.table<IUser>(this.table).findUnique({
			where: { email: email.value },
		});
	}

	async update(id: string, user: User): Promise<UserResponseDTO> {
		const mappedUser = UserMapper.toDatabaseUpdate(user);

		return await this.db.table<IUser>(this.table).update({
			where: { id },
			data: mappedUser,
			omit: ["password"],
		});
	}

	async delete(id: string): Promise<void> {
		await this.db.table<IUser>(this.table).delete({ where: { id } });
	}
}
