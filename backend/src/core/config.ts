try {
	process.loadEnvFile();
} catch {
	console.error("[ERROR] ❌ .env file not found!");
}

const getRequiredEnv = (key: string): string => {
	const value = process.env[key];
	if (!value) throw new Error(`Environment variable ${key} is required`);
	return value;
};

const databaseConfig = {
	url: getRequiredEnv("DATABASE_URL"),
	type: process.env.DB_TYPE ?? "postgres",
	host: process.env.DB_HOST ?? "localhost",
	port: parseInt(process.env.DB_PORT ?? "5432", 10),
	username: process.env.DB_USER ?? "postgres",
	password: process.env.DB_PASSWORD ?? "postgres",
	database: process.env.DB_NAME ?? "postgres",
};

export const config = {
	env: process.env.NODE_ENV ?? "development",
	port: parseInt(process.env.PORT ?? "3000", 10),
	db: databaseConfig,
};
