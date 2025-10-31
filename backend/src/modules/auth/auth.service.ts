import { Password } from "@/common/value-objects/password.vo";
import { HttpError } from "@/core/errors/HttpError";
import type { CreateUserDTO } from "../users/user.dto";
import { UserMapper } from "../users/user.mapper";
import type UsersService from "../users/users.service";
import type { SignInDTO } from "./auth.dto";

export class AuthService {
	constructor(private readonly userService: UsersService) {}

	async signUp(data: CreateUserDTO) {
		const createdUser = await this.userService.create(data);
		return createdUser;
	}

	async signIn(data: SignInDTO) {
		const existsUser = await this.userService.getByEmail(data.email);
		if (!existsUser) throw HttpError.Unauthorized("Invalid credentials!");

		const isPasswordValid = await Password.compare(existsUser.password, data.password);
		if (!isPasswordValid) throw HttpError.Unauthorized("Invalid credentials!");

		return UserMapper.toResponse(existsUser);
	}
}
