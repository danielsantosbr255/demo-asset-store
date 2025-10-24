import { AppModule } from "./app.module";
import { AppFactory } from "./core/AppFactory";
import { config } from "./core/config";

const bootstrap = () => {
  const app = AppFactory.create(AppModule);

  app.listen(config.port);
};

bootstrap();
