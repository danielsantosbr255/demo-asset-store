import type { Router } from 'express';

export interface IModule {
  name: string;
  router: Router;
  imports?: (new () => IModule)[];
  controller?: object;
  service?: object;
  repository?: object;
}
