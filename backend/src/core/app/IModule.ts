import type { Router } from "express";

export type AppRouter = Router & {};
export type ModuleConstructor = new (router: AppRouter) => IModule;

export interface IModule {
	readonly path: string;
	readonly router: Router;
	readonly imports?: ModuleConstructor[];
	readonly controller?: object;
	readonly service?: object;
}
