import type { PaginationMetadata, PaginationQueryParams } from "@/_types/pagination.js";
import { createPaginationMetadata, parsePaginationParams } from "@/common/utils/pagination.util.js";
import { Email } from "@/common/value-objects/email.vo.js";
import { HttpError } from "@/core/errors/HttpError.js";
import type { CreateUserDTO, IUser, UpdateUserDTO, UserResponseDTO } from "./user.dto.js";
import { User } from "./user.entity.js";
import type { UsersRepository } from "./users.repository.js";

type Query = PaginationQueryParams & {
	name?: string;
	email?: string;
};

type GetManyResponse = {
	users: UserResponseDTO[];
	metadata: PaginationMetadata;
};

export default class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	async create(data: CreateUserDTO): Promise<UserResponseDTO> {
		const userEntity = await User.create(data);

		const userExists = await this.repository.getByEmail(userEntity.email);

		if (userExists) throw HttpError.Conflict("User already exists!");

		const user = await this.repository.create(userEntity);

		return user;
	}

	async getMany(query: Query): Promise<GetManyResponse> {
		const where: Record<string, string> = {};
		const { page, pageSize, offset } = parsePaginationParams(query);

		if (query.name) where.name = query.name;
		if (query.email) where.email = query.email;

		const { users, totalItems } = await this.repository.getMany({
			where,
			limit: pageSize,
			offset,
		});

		const metadata = createPaginationMetadata({ page, pageSize, totalItems });

		return { users, metadata };
	}

	async getById(id: string): Promise<UpdateUserDTO | null> {
		return this.repository.getById(id);
	}

	async getByEmail(email: string): Promise<IUser | null> {
		return this.repository.getByEmail(Email.create(email));
	}

	async update(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
		const userExists = await this.repository.getById(id);
		if (!userExists) throw HttpError.NotFound("User not found!");

		if (data.email && data.email !== userExists.email) {
			const emailExists = await this.repository.getByEmail(Email.create(data.email));
			if (emailExists) throw HttpError.Conflict("Email already registered!");
		}

		const userEntity = User.restore(userExists);

		if (data.name) userEntity.updateName(data.name);
		if (data.email) userEntity.updateEmail(data.email);

		return await this.repository.update(id, userEntity);
	}

	async delete(id: string): Promise<void> {
		const user = await this.repository.getById(id);

		if (!user) throw HttpError.NotFound("User not found!");
		this.repository.delete(id);
	}
}
