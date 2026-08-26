import { execute } from "../database/database.js";

export async function findPromotionById(id) {
  const result = await execute(
    `SELECT id, campaign_id, name, description, amount, status, created_at, updated_at
            FROM promotions WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listPromotions({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  campaignId = null,
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

  if (campaignId) {
    conditions.push(`campaign_id = ?`);
    parameters.push(campaignId);
  }

  if (websiteIds !== null) {
    if (websiteIds.length === 0) {
      return {
        rows: [],
        total: 0,
      };
    }
    const placeholder = websiteIds.map(() => `?`).join(",");
    conditions.push(`campaigns.website_id IN (${placeholder})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const fromClause = `FROM promotions INNER JOIN campaigns ON campaigns.id = promotions.campaign_id ${whereClause}`;

  const countResult = await execute(
    `SELECT COUNT(*) AS total ${fromClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT promotions.id, promotions.campaign_id, promotions.name, promotions.description, promotions.amount, promotions.status, promotions.created_at, promotions.updated_at ${fromClause} ORDER BY promotions.created_at DESC, promotions.name ASC LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createPromotion({
  id,
  campaignId,
  name,
  description,
  amount,
  status,
}) {
  return execute(
    `INSERT INTO promotions (id, campaign_id, name, description, amount, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, campaignId, name, description, amount, status],
  );
}

export async function updatePromotion({ id, name, description, amount }) {
  return execute(
    `UPDATE promotions SET name = ?, description = ?, amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, description, amount, id],
  );
}

export async function updatePromotionStatus(id, status) {
  return execute(
    `UPDATE promotions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
  );
}
