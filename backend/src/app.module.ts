import { Router } from "express";
import { IModule } from "./core/IModule";
import { AppController } from "./app.controller";

export class AppModule implements IModule {
  name = "/";
  router: Router = Router();

  controller = new AppController();
  imports = [];

  constructor() {
    this.router.get("/", this.controller.getHello);
  }
}
