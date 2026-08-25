import crypto from "node:crypto";
import { execute } from "../database/database.js";
import { hashPassword } from "../security/passwordService.js";

export async function bootstrapAdministrator() {
  const username = process.env.INITIAL_ADMIN_USERNAME;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const displayName = process.env.INITIAL_ADMIN_DISPLAY_NAME;

  if (!username || !password || !displayName) {
    throw new Error("Initial Administrator configuration is missing");
  }

  const roleResult = await execute(
    `SELECT id FROM roles WHERE name = ? LIMIT 1`,
    ["Administrator"],
  );

  if (roleResult.rows.length === 0) {
    throw new Error(
      "Administrator role does not exist. Run database migrations first.",
    );
  }

  const administratorRoleId = roleResult.rows[0].id;

  const existingAdministrator = await execute(
    `SELECT u.id FROM users u WHERE u.role_id = ? LIMIT 1`,
    [administratorRoleId],
  );

  if (existingAdministrator.rows.length > 0) {
    return {
      created: false,
    };
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  await execute(
    `INSERT INTO users (id, username, display_name, password_hash, role_id, status, must_change_password, last_login_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'Active', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [userId, username, displayName, passwordHash, administratorRoleId],
  );

  return {
    created: true,
    userId,
  };
}
