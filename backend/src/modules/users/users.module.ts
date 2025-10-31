import { getDb } from "@/common/database";
import { AuthGuard } from "@/common/middlewares/auth.middleware";
import type { AppRouter, IModule } from "@/core/app/IModule";
import UsersController from "./users.controller";
import { UsersRepository } from "./users.repository";
import UsersService from "./users.service";

export class UsersModule implements IModule {
	readonly path = "users";

	readonly repository = new UsersRepository(getDb());
	readonly service = new UsersService(this.repository);
	readonly controller = new UsersController(this.service);

	constructor(readonly router: AppRouter) {
		this.router.get("/", this.controller.getMany);
		this.router.post("/", AuthGuard, this.controller.create);
		this.router.get("/:id", AuthGuard, this.controller.getById);
		this.router.put("/:id", AuthGuard, this.controller.update);
		this.router.delete("/:id", AuthGuard, this.controller.delete);
	}
}
