import { logger } from "@/common/utils/logger.util";
import type { IDatabase, ITable } from "../IDatabase";
import type { CountArgs, CreateArgs, DeleteArgs, FindArgs, FindUniqueArgs, UpdateArgs } from "../IDatabase.js";

class MemoryTable<T> implements ITable<T> {
	private rows: T[] = [];
	private readonly delay = 100;

	create(args: CreateArgs<T>): Promise<T> {
		const data = args.data;
		this.rows.push(data);
		return new Promise((resolve) => setTimeout(() => resolve(data), this.delay));
	}

	findMany(args?: FindArgs<T> | undefined): Promise<T[]> {
		const where = args?.where;
		const limit = args?.limit;
		let result = this.rows;

		if (where && Object.keys(where).length > 0) {
			const keys = Object.keys(where) as (keyof T)[];
			result = this.rows.filter((r) => keys.every((key) => r[key] === where[key]));
		}

		if (args?.offset) result = result.slice(args.offset);
		if (args?.limit) result = result.slice(0, limit);

		return new Promise((resolve) => setTimeout(() => resolve(result), this.delay));
	}

	findUnique(args: FindUniqueArgs<T>): Promise<T | null> {
		const where = args.where;
		if (!where || Object.keys(where).length === 0) throw new Error('findUnique require "where" parameter');

		const keys = Object.keys(where) as (keyof T)[];
		const row = this.rows.find((r) => keys.every((key) => r[key] === where[key]));

		return new Promise((resolve) => setTimeout(() => resolve(row ?? null), this.delay));
	}

	update(args: UpdateArgs<T>): Promise<T> {
		const where = args.where;
		const data = args.data;
		const keys = Object.keys(where) as (keyof T)[];
		const rowIndex = this.rows.findIndex((r) => keys.every((key) => r[key] === where[key]));

		if (rowIndex === -1) throw new Error('update require "where" parameter');

		const updatedRow = { ...(this.rows[rowIndex] as T), ...data };
		this.rows[rowIndex] = updatedRow;
		return new Promise((resolve) => setTimeout(() => resolve(updatedRow), this.delay));
	}

	delete(args: DeleteArgs<T>): Promise<T> {
		const where = args.where;
		const keys = Object.keys(where) as (keyof T)[];
		const rowIndex = this.rows.findIndex((r) => keys.every((key) => r[key] === where[key]));

		if (rowIndex === -1) throw new Error('delete require "where" parameter');

		const deletedRow = this.rows[rowIndex] as T;
		this.rows.splice(rowIndex, 1);
		return new Promise((resolve) => setTimeout(() => resolve(deletedRow), this.delay));
	}

	count(args: CountArgs<T>): Promise<number> {
		const where = args.where;
		let result = this.rows;

		if (where && Object.keys(where).length > 0) {
			const keys = Object.keys(where) as (keyof T)[];
			result = this.rows.filter((r) => keys.every((key) => r[key] === where[key]));
		}

		return new Promise((resolve) => setTimeout(() => resolve(result.length), this.delay));
	}
}

export class MemoryAdapter implements IDatabase {
	// biome-ignore lint: suspicious/noExplicitAny
	private tables: Record<string, MemoryTable<any>> = {};

	async connect() {
		logger.info("✅ Banco em memória conectado");
	}

	async disconnect() {
		logger.info("✅ Banco em memória desconectado");
	}

	table<T>(name: string) {
		this.tables[name] ??= new MemoryTable<T>();
		return this.tables[name] as ITable<T>;
	}
}
