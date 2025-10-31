import { logger } from "@/common/utils/logger.util";
import { config } from "../../core/config";
import type { IDatabase } from "./IDatabase";
import { MemoryAdapter } from "./in-memory/in-memory.adapter.ts";
import { PostgresAdapter } from "./postgres/postgres.adapter";

let dbInstance: IDatabase | null = null;

export const initDb = async (): Promise<void> => {
	if (dbInstance) return;

	const memoryAdapter = new MemoryAdapter();
	const postgresAdapter = new PostgresAdapter({ connectionString: config.db.url });

	dbInstance = config.db.type === "postgres" ? postgresAdapter : memoryAdapter;
	logger.info(`Database type: ${config.db.type}`);

	await dbInstance.connect();
};

export const getDb = (): IDatabase => {
	if (!dbInstance) throw new Error("Database not initialized. Call initDb() first.");
	return dbInstance;
};
