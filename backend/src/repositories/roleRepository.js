import { execute } from "../database/database.js";

export async function findRoleById(id) {
  const result = await execute(
    `
      SELECT
        id,
        name,
        description,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM roles
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}
