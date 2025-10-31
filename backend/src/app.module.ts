import type { Router } from "express";
import { AppController } from "./app.controller";
import type { IModule } from "./core/app/IModule";
import { AuthModule } from "./modules/auth/auth.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { UsersModule } from "./modules/users/users.module";

export class AppModule implements IModule {
	path = "/";

	controller = new AppController();
	imports = [AuthModule, UsersModule, SessionsModule];

	constructor(public readonly router: Router) {
		this.router.get("/", this.controller.getHello);
	}
}
