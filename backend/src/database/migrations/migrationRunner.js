import { execute, withTransaction } from "../database.js";

async function ensureMigrationTable() {
  await execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
}

async function getAppliedMigrations() {
  const result = await execute(
    `SELECT version FROM schema_migrations ORDER BY version ASC`,
  );
  return result.rows;
}

export async function runMigrations(migrations) {
  await ensureMigrationTable();

  const appliedMigrations = await getAppliedMigrations();
  const appliedVersions = new Set(
    appliedMigrations.map((migration) => Number(migration.version)),
  );

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }
    console.log(
      `[Database] Applying migration ${migration.version}: ${migration.name}`,
    );

    await withTransaction(async (transaction) => {
      await migration.up(transaction);
      await transaction.execute(
        `INSERT INTO schema_migrations (version, name) VALUES (?, ?)`,
        [migration.version, migration.name],
      );
    });

    console.log(
      `[Database] Migration ${migration.version} applied successfully`,
    );
  }
}
