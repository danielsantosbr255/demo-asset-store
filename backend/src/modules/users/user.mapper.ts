import type { IUser } from "./user.dto";
import { User } from "./user.entity";

export class UserMapper {
	static toDatabaseUpdate(user: User): Partial<IUser> {
		return {
			name: user.name.value,
			email: user.email.value,
			updated_at: user.updated_at,
		};
	}

	static toDatabase(user: User): IUser {
		return {
			id: user.id,
			name: user.name.value,
			email: user.email.value,
			password: user.password.hashed,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}

	static fromDatabase(user: IUser): User {
		return User.restore(user);
	}

	static toResponse(user: IUser) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}
}
