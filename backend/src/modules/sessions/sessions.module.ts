import { getDb } from "@/common/database";
import type { AppRouter, IModule } from "@/core/app/IModule";
import { SessionsController } from "./sessions.controller";
import { SessionsRepository } from "./sessions.repository";
import { SessionsService } from "./sessions.service";

export class SessionsModule implements IModule {
	path = "sessions";

	readonly repository = new SessionsRepository(getDb());
	readonly service = new SessionsService(this.repository);
	readonly controller = new SessionsController(this.service);

	constructor(readonly router: AppRouter) {
		this.router.post("/", this.controller.create);
		this.router.get("/", this.controller.getMany);
		this.router.get("/:id", this.controller.getById);
		this.router.delete("/:id", this.controller.delete);
	}
}
