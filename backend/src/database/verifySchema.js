import { execute } from "./database.js";

const expectedTables = [
  "roles",
  "permissions",
  "websites",
  "users",
  "role_permissions",
  "user_website_access",
  "customers",
  "campaigns",
  "campaign_participations",
  "call_attempts",
  "campaign_discussions",
  "promotions",
  "promotion_receipts",
  "audit_logs",
];

export async function verifySchema() {
  const result = await execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  );

  const actualTables = result.rows
    .map((row) => row.name)
    .filter((name) => name !== "schema_migrations");

  const missingTables = expectedTables.filter(
    (table) => !actualTables.includes(table),
  );

  const unexpectedTables = actualTables.filter(
    (table) => !expectedTables.includes(table),
  );

  if (missingTables.length > 0) {
    throw new Error(`Missing tables: ${missingTables.join(", ")}`);
  }

  if (unexpectedTables.length > 0) {
    throw new Error(`Unexpected tables: ${unexpectedTables.join(", ")}`);
  }

  console.log(
    `[Database] Schema verification passed: ${expectedTables.length} tables.`,
  );
}
