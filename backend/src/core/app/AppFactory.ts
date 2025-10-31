import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, Router } from "express";
import { errorHandler } from "@/common/middlewares/error-handler.middleware";
import { logger } from "@/common/utils/logger.util";
import type { IModule, ModuleConstructor } from "./IModule";

export class AppFactory {
	constructor(
		private readonly rootModule: IModule,
		private prefix: string = "",
		private readonly app: Express = express(),
		private readonly router: Router = Router(),
	) {
		this.enableCors();
		this.registerMiddlewares();
		this.setGlobalPrefix("/api/v1");
		this.registerRouter();
		this.useErrorHandler();
	}

	static create(rootModule: ModuleConstructor): AppFactory {
		return new AppFactory(new rootModule(Router()));
	}

	public setGlobalPrefix(prefix: string): void {
		this.prefix = prefix;
	}

	public enableCors(): void {
		this.app.use(cors({ origin: "*", credentials: true }));
	}

	private registerMiddlewares(): void {
		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private registerRouter(): void {
		this.app.use(this.prefix, this.router);
		this.router.use(this.rootModule.path, this.rootModule.router);

		if (this.rootModule.imports) {
			for (const mod of this.rootModule.imports) {
				const module = new mod(Router());
				const path = `/${module.path}`;

				this.router.use(path, module.router);
				logger.info(`🧩 Registered module '${module.path}' at ${module.path}${path}`);
			}
		}

		this.app.use((_, res) => res.status(404).json({ message: "Route not found!" }));
	}

	private useErrorHandler(): void {
		this.app.use(errorHandler);
	}

	public listen(port: number) {
		const server = this.app.listen(port, () => {
			logger.info(`🚀 Server running: http://localhost:${port}${this.prefix}`);
		});

		server.on("error", (err) => {
			logger.error("❌ Server failed to start:", err);
			process.exit(1);
		});
	}
}
