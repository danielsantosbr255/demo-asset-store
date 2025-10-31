import { Pool, type PoolConfig, type QueryResult } from "pg";
import { logger } from "@/common/utils/logger.util";
import { HttpError } from "@/core/errors/HttpError";
import type { IDatabase, ITable } from "../IDatabase";
import type { CountArgs, CreateArgs, DeleteArgs, FindArgs, FindUniqueArgs, UpdateArgs } from "../IDatabase.js";
import { buildSelectClause, buildSetClause, buildWhereClause, ERROR_MESSAGES } from "./queryBuilder.js";

class PostgresTable<T, O> implements ITable<T, O> {
	constructor(
		private readonly pool: Pool,
		private readonly tableName: string,
	) {}

	private async executeQuery(query: string, values: unknown[] = []): Promise<QueryResult> {
		try {
			return await this.pool.query(query, values);
		} catch (error) {
			logger.error(`❌ Error executing query (${this.tableName}):`, error);
			throw HttpError.InternalServerError();
		}
	}

	async create(args: CreateArgs<T>): Promise<O> {
		const data = args.data;
		const { select, omit } = args;
		const columns = await buildSelectClause<T>(this.pool, this.tableName, select, omit);

		if (!data || Object.keys(data).length === 0) {
			throw new Error(ERROR_MESSAGES.CREATE_DATA_REQUIRED);
		}

		const keys = Object.keys(data);
		const values = Object.values(data);
		const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

		const query = `
      INSERT INTO ${this.tableName} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING ${columns}
    `;

		const { rows } = await this.executeQuery(query, values);
		return rows[0];
	}

	async findMany(args?: FindArgs<T>): Promise<T[]> {
		const { where, limit, offset, select, omit } = args || {};
		const { whereClause, values } = buildWhereClause(where);
		const columns = await buildSelectClause<T>(this.pool, this.tableName, select, omit);

		let query = `SELECT ${columns} FROM ${this.tableName} ${whereClause}`;

		if (limit) query += ` LIMIT ${limit}`;
		if (offset) query += ` OFFSET ${offset}`;

		const { rows } = await this.executeQuery(query, values);
		return rows;
	}

	async findUnique(args: FindUniqueArgs<T>): Promise<O | null> {
		const { where, select, omit } = args;
		if (!where || Object.keys(where).length === 0) {
			throw new Error(ERROR_MESSAGES.FIND_UNIQUE_WHERE_REQUIRED);
		}

		const { whereClause, values } = buildWhereClause(where);
		const columns = await buildSelectClause<T>(this.pool, this.tableName, select, omit);

		const query = `SELECT ${columns} FROM ${this.tableName} ${whereClause} LIMIT 1`;
		const { rows } = await this.executeQuery(query, values);
		return rows[0] ?? null;
	}

	async update(args: UpdateArgs<T>): Promise<T> {
		const { where, data, omit, select } = args;
		if (!where || !data) throw new Error(ERROR_MESSAGES.UPDATE_REQUIRED);

		const { setClause, values: setValues } = buildSetClause(data, 1);
		const whereStartIndex = setValues.length + 1;

		const { whereClause, values: whereValues } = buildWhereClause(where, whereStartIndex);
		const allValues = [...setValues, ...whereValues];

		const columns = await buildSelectClause<T>(this.pool, this.tableName, select, omit);

		const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      ${whereClause}
      RETURNING ${columns}
    `;

		const { rows } = await this.executeQuery(query, allValues);
		return rows[0];
	}

	async delete(args: DeleteArgs<T>): Promise<T> {
		const { where, omit, select } = args;
		if (!where) throw new Error(ERROR_MESSAGES.DELETE_WHERE_REQUIRED);

		const columns = await buildSelectClause<T>(this.pool, this.tableName, select, omit);
		const { whereClause, values } = buildWhereClause(where);

		const query = `DELETE FROM ${this.tableName} ${whereClause} RETURNING ${columns}`;
		const { rows } = await this.executeQuery(query, values);
		return rows[0];
	}

	async count(args: CountArgs<T> = {}): Promise<number> {
		const { whereClause, values } = buildWhereClause(args.where);
		const query = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;
		const { rows } = await this.executeQuery(query, values);
		return parseInt(rows[0].count, 10);
	}
}

export class PostgresAdapter implements IDatabase {
	public readonly pool: Pool;

	constructor(config: PoolConfig) {
		this.pool = new Pool(config);
	}

	async connect(): Promise<void> {
		try {
			await this.pool.query("SELECT 1 + 1");
			logger.info("🏦 PostgreSQL connected");
		} catch (error) {
			logger.error("❌ Error connecting to PostgreSQL:", error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		await this.pool.end();
		logger.info("✅ PostgreSQL disconnected");
	}

	table<I, O = I>(table: string): ITable<I, O> {
		return new PostgresTable<I, O>(this.pool, table);
	}
}
