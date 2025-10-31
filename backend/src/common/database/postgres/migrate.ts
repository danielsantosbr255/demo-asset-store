import fs from "node:fs";
import path, { resolve } from "node:path";
import { getDb, initDb } from "../index";
import type { PostgresAdapter } from "./postgres.adapter";

async function runMigrations() {
	await initDb();
	const db = getDb() as PostgresAdapter;
	const pool = db.pool;

	try {
		// 1. Garantir que a tabela migrations exista
		await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        run_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

		// 2. Ler todos os arquivos da pasta migrations
		const migrationsDir = path.join(resolve(__dirname), "migrations");
		const files = fs.readdirSync(migrationsDir).sort();

		// 3. Ver quais já rodaram
		const { rows: appliedMigrations } = await pool.query(`SELECT name FROM migrations`);
		const appliedSet = new Set(appliedMigrations.map((m) => m.name));

		// 4. Rodar apenas os novos
		for (const file of files) {
			if (appliedSet.has(file)) {
				console.log(`⏩ Skipping already applied: ${file}`);
				continue;
			}

			const filePath = path.join(migrationsDir, file);
			const sql = fs.readFileSync(filePath, "utf-8");

			console.log(`🚀 Running migration: ${file}`);
			await pool.query(sql);

			// 5. Registrar que essa migration rodou
			await pool.query(`INSERT INTO migrations (name) VALUES ($1)`, [file]);
		}

		console.log("✅ All migrations executed successfully!");
	} catch (err) {
		console.error("❌ Migration error:", err);
		process.exit(1);
	} finally {
		await db.disconnect();
		process.exit(0);
	}
}

runMigrations();
