import { AppModule } from "./app.module";
import { initDb } from "./common/database";
import { AppFactory } from "./core/app/AppFactory";
import { config } from "./core/config";

const bootstrap = async () => {
	await initDb();

	const app = AppFactory.create(AppModule);

	app.listen(config.port);
};

bootstrap().catch((err) => console.error(err));
