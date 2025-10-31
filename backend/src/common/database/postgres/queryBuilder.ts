import type { Pool } from "pg";

const tableColumnsCache = new Map<string, string[]>();

async function getTableColumns(pool: Pool, tableName: string): Promise<string[]> {
	if (tableColumnsCache.has(tableName)) return tableColumnsCache.get(tableName) as string[];

	const query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
  `;

	const { rows } = await pool.query(query, [tableName]);
	const columns = rows.map((r) => r.column_name);
	tableColumnsCache.set(tableName, columns);
	return columns;
}

export async function buildSelectClause<T>(
	pool: Pool,
	tableName: string,
	select?: (keyof T)[],
	omit?: (keyof T)[],
): Promise<string> {
	if (select && select.length > 0) {
		return select.join(", ");
	}

	if (omit && omit.length > 0) {
		const allColumns = await getTableColumns(pool, tableName);
		const filtered = allColumns.filter((col) => !omit.includes(col as keyof T));
		return filtered.join(", ");
	}

	return "*";
}

export function buildWhereClause(where: Record<string, unknown> | undefined, startIndex: number = 1) {
	if (!where || Object.keys(where).length === 0) {
		return { whereClause: "", values: [] };
	}

	const keys = Object.keys(where);
	const values = Object.values(where);

	const conditions = keys.map((key, index) => `${key} = $${startIndex + index}`).join(" AND ");

	return {
		whereClause: `WHERE ${conditions}`,
		values,
	};
}

export function buildSetClause(data: Record<string, unknown>, startIndex: number = 1) {
	const keys = Object.keys(data);
	const values = Object.values(data);

	const setClause = keys.map((key, index) => `${key} = $${startIndex + index}`).join(", ");

	return {
		setClause,
		values,
	};
}

export const ERROR_MESSAGES = {
	CREATE_DATA_REQUIRED: "create requer o parâmetro 'data'",
	FIND_UNIQUE_WHERE_REQUIRED: "findUnique requer o parâmetro 'where'",
	UPDATE_REQUIRED: "update requer os parâmetros 'where' e 'data'",
	DELETE_WHERE_REQUIRED: "delete requer o parâmetro 'where'",
};
