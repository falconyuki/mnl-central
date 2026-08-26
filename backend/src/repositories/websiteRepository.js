import { execute } from "../database/database.js";

export async function findWebsiteById(id) {
  const result = await execute(
    `SELECT id, name, code, description, status, created_at, updated_at
        FROM websites WHERE id = ? LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function findWebsiteByCode(code) {
  const result = await execute(
    `SELECT id, name, code, description, status, created_at, updated_at
        FROM websites WHERE code = ? LIMIT 1`,
    [code],
  );

  return result.rows[0] ?? null;
}

export async function listWebsites({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  websiteIds = null,
} = {}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (search) {
    conditions.push(`(name LIKE ? OR code LIKE ?)`);
    const searchPattern = `%${search}%`;
    parameters.push(searchPattern, searchPattern);
  }

  if (status) {
    conditions.push(`status = ?`);
    parameters.push(status);
  }

  if (websiteIds !== null) {
    if (websiteIds.length === 0) {
      return {
        rows: [],
        total: 0,
      };
    }

    const placeholders = websiteIds.map(() => "?").join(", ");
    conditions.push(`id IN (${placeholders})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await execute(
    `SELECT COUNT(*) AS total
        FROM websites ${whereClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT id, name, code, description, status, created_at, updated_at
        FROM websites ${whereClause}
        ORDER BY name ASC
        LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createWebsite({ id, name, code, description, status }) {
  return execute(
    `INSERT INTO websites (id, name, code, description, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, name, code, description, status],
  );
}

export async function updateWebsite({ id, name, code, description }) {
  return execute(
    `UPDATE websites
        SET name = ?, code = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
    [name, code, description, id],
  );
}

export async function updateWebsiteStatus(id, status) {
  return execute(
    `UPDATE websites
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
    [status, id],
  );
}
