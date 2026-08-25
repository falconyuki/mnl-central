import { execute } from "./database.js";
import { migrations } from "./migrations/migrations.js";
import { runMigrations } from "./migrations/migrationRunner.js";
import { verifySchema } from "./verifySchema.js";
import { bootstrapAdministrator } from "../services/bootstrapService.js";

export async function initializeDb() {
  await execute(`PRAGMA foreign_keys = ON;`);
  const result = await execute("PRAGMA foreign_keys;");
  const enabled = Number(result.rows[0].foreign_keys) === 1;
  if (!enabled) {
    throw new Error("Foreign keys are not enabled");
  }
  console.log("Foreign keys are enabled");
  await runMigrations(migrations);
  await verifySchema();
  const bootstrapResult = await bootstrapAdministrator();
  if (bootstrapResult.created) {
    console.log("[Security] Initial Administrator account created.");
  }
}
