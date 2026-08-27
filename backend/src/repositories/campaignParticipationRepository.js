import { execute } from "../database/database.js";

export async function findCampaignParticipationById(id) {
  const result = await execute(
    `SELECT id, campaign_id AS campaignId, customer_id AS customerId, status, created_at AS createdAt, updated_at AS updatedAt
        FROM campaign_participations WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findCampaignParticipationByCampaignAndCustomer(
  campaignId,
  customerId,
) {
  const result = await execute(
    `SELECT id, campaign_id AS campaignId, customer_id AS customerId, status, created_at AS createdAt, updated_at AS updatedAt
        FROM campaign_participations WHERE campaign_id = ? AND customer_id = ? LIMIT 1`,
    [campaignId, customerId],
  );
  return result.rows[0] ?? null;
}

export async function listCampaignParticipations({
  page = 1,
  pageSize = 20,
  status = null,
  campaignId = null,
  customerId = null,
  websiteIds = null,
}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (status) {
    conditions.push(`cp.status = ?`);
    parameters.push(status);
  }

  if (campaignId) {
    conditions.push(`cp.campaign_id = ?`);
    parameters.push(campaignId);
  }

  if (customerId) {
    conditions.push(`cp.customer_id = ?`);
    parameters.push(customerId);
  }

  if (websiteIds !== null) {
    if (websiteIds.length === 0) {
      return {
        rows: [],
        total: 0,
      };
    }
    const placeholder = websiteIds.map(() => `?`).join(",");
    conditions.push(`c.website_id IN (${placeholder})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await execute(
    `SELECT COUNT(*) AS total FROM campaign_participations cp
    INNER JOIN campaigns c ON c.id = cp.campaign_id
    ${whereClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT cp.id, cp.campaign_id AS campaignId, cp.customer_id AS customerId, cp.status, cp.created_at AS createdAt, cp.updated_at AS updatedAt FROM campaign_participations cp
    INNER JOIN campaigns c ON c.id = cp.campaign_id
    ${whereClause}
    ORDER BY cp.created_at DESC, cp.id ASC LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createCampaignParticipation({
  id,
  campaignId,
  customerId,
  status,
}) {
  return execute(
    `INSERT INTO campaign_participations (id, campaign_id, customer_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, campaignId, customerId, status],
  );
}

export async function updateCampaignParticipationStatus({ id, status }) {
  return execute(
    `UPDATE campaign_participations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
  );
}

export async function expireActiveCampaignParticipations(
  campaignId,
  transaction = null,
) {
  const executor = transaction ?? { execute };

  return executor.execute(
    `UPDATE campaign_participations
        SET status = 'Expired',
            updated_at = CURRENT_TIMESTAMP
      WHERE campaign_id = ?
        AND status = 'Active'`,
    [campaignId],
  );
}
