import { getDb } from "@/common/database";
import { AuthGuard } from "@/common/middlewares/auth.middleware";
import type { AppRouter, IModule } from "@/core/app/IModule";
import { SessionsRepository } from "../sessions/sessions.repository";
import { SessionsService } from "../sessions/sessions.service";
import { UsersRepository } from "../users/users.repository";
import UsersService from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

export class AuthModule implements IModule {
	readonly path = "auth";

	readonly usersRepository = new UsersRepository(getDb());
	readonly usersService = new UsersService(this.usersRepository);

	readonly sessionsRepository = new SessionsRepository(getDb());
	readonly sessionsService = new SessionsService(this.sessionsRepository);

	readonly service = new AuthService(this.usersService);
	readonly controller = new AuthController(this.service, this.sessionsService);

	constructor(readonly router: AppRouter) {
		this.router.post("/sign-up", this.controller.signUp);
		this.router.post("/sign-in", this.controller.signIn);
		this.router.post("/sign-out", AuthGuard, this.controller.signOut);
	}
}
