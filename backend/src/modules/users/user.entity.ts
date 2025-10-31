import { v7 as uuidv7 } from "uuid";
import { Email } from "@/common/value-objects/email.vo";
import { Name } from "@/common/value-objects/name.vo";
import { Password } from "@/common/value-objects/password.vo";
import type { CreateUserDTO, IUser } from "./user.dto";

export class User {
	private constructor(
		private _id: string,
		private _name: Name,
		private _email: Email,
		private _password: Password,
		private _createdAt: Date,
		private _updatedAt: Date,
	) {}

	public static async create(data: CreateUserDTO): Promise<User> {
		const id = data.id || uuidv7();
		const name = Name.create(data.name);
		const email = Email.create(data.email);
		const password = await Password.create(data.password);
		const created_at = new Date();
		const updated_at = new Date();

		return new User(id, name, email, password, created_at, updated_at);
	}

	public static restore(data: IUser): User {
		const id = data.id;
		const name = Name.create(data.name);
		const email = Email.create(data.email);
		const password = Password.restore(data.password);
		const created_at = data.created_at;
		const updated_at = data.updated_at;

		return new User(id, name, email, password, created_at, updated_at);
	}

	public updateName(newName: string): void {
		this._name = Name.create(newName);
		this._updatedAt = new Date();
	}

	public updateEmail(newEmail: string): void {
		this._email = Email.create(newEmail);
		this._updatedAt = new Date();
	}

	public async updatePassword(newPassword: string): Promise<void> {
		this._password = await Password.create(newPassword);
		this._updatedAt = new Date();
	}

	public get id(): string {
		return this._id;
	}
	public get name(): Name {
		return this._name;
	}
	public get email(): Email {
		return this._email;
	}
	public get password(): Password {
		return this._password;
	}
	public get created_at(): Date {
		return this._createdAt;
	}
	public get updated_at(): Date {
		return this._updatedAt;
	}
}
