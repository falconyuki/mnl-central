import { execute } from "../database/database.js";

export async function findCampaignById(id) {
  const result = await execute(
    `SELECT id, website_id AS websiteId, name, description, start_date AS startDate, end_date AS endDate, status, created_by AS createdBy, created_at AS createdAt, updated_at AS updatedAt
        FROM campaigns WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listCampaigns({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  websiteIds = null,
}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (search) {
    conditions.push(`(name LIKE ? OR description LIKE ?)`);
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
    const placeholder = websiteIds.map(() => `?`).join(",");
    conditions.push(`website_id IN (${placeholder})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await execute(
    `SELECT COUNT(*) AS total FROM campaigns ${whereClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT id, website_id AS websiteId, name, description, start_date AS startDate, end_date AS endDate, status, created_by AS createdBy, created_at AS createdAt, updated_at AS updatedAt FROM campaigns ${whereClause} ORDER BY start_date DESC, name ASC LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createCampaign({
  id,
  websiteId,
  name,
  description,
  startDate,
  endDate,
  status,
  createdBy,
}) {
  return execute(
    `INSERT INTO campaigns (id, website_id, name, description, start_date, end_date, status, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, websiteId, name, description, startDate, endDate, status, createdBy],
  );
}

export async function updateCampaign({
  id,
  name,
  description,
  startDate,
  endDate,
}) {
  return execute(
    `UPDATE campaigns SET name = ?, description = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, description, startDate, endDate, id],
  );
}

export async function updateCampaignStatus(id, status) {
  return execute(
    `UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
  );
}
