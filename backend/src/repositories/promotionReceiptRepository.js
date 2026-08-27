import { execute } from "../database/database.js";

export async function findPromotionReceiptById(id) {
  const result = await execute(
    `SELECT id, promotion_id AS promotionId, campaign_participation_id AS campaignParticipationId, status, received_at AS receivedAt, staff_user_id AS staffUserId, remarks, created_at AS createdAt, updated_at AS updatedAt
    FROM promotion_receipts WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findPromotionReceiptByPromotionAndParticipation(
  promotionId,
  campaignParticipationId,
) {
  const result = await execute(
    `SELECT id, promotion_id as promotionId, campaign_participation_id AS campaignParticipationId, status, received_at AS receivedAt, staff_user_id AS staffUserId, remarks, created_at AS createdAt, updated_at AS updatedAt
    FROM promotion_receipts WHERE promotion_id = ? AND campaign_participation_id = ? LIMIT 1`,
    [promotionId, campaignParticipationId],
  );
  return result.rows[0] ?? null;
}

export async function listPromotionReceipts({
  page = 1,
  pageSize = 20,
  status = null,
  promotionId = null,
  campaignParticipationId = null,
  staffUserId = null,
  websiteIds = null,
}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (status) {
    conditions.push(`pr.status = ?`);
    parameters.push(status);
  }

  if (promotionId) {
    conditions.push(`pr.promotion_id = ?`);
    parameters.push(promotionId);
  }

  if (campaignParticipationId) {
    conditions.push(`pr.campaign_participation_id = ?`);
    parameters.push(campaignParticipationId);
  }

  if (staffUserId) {
    conditions.push(`pr.staff_user_id = ?`);
    parameters.push(staffUserId);
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
    `SELECT COUNT(*) AS total FROM promotion_receipts pr
    INNER JOIN promotions p ON p.id = pr.promotion_id
    INNER JOIN campaigns c ON c.id = p.campaign_id
    ${whereClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT pr.id, pr.promotion_id AS promotionId, pr.campaign_participation_id AS campaignParticipationId, pr.status, pr.received_at AS receivedAt, pr.staff_user_id AS staffUserId, pr.remarks, pr.created_at AS createdAt, pr.updated_at AS updatedAt
    FROM promotion_receipts pr
    INNER JOIN promotions p ON p.id = pr.promotion_id
    INNER JOIN campaigns c ON c.id = p.campaign_id
    ${whereClause}
    ORDER BY pr.created_at DESC, pr.id ASC LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createPromotionReceipt({
  id,
  promotionId,
  campaignParticipationId,
  status,
  receivedAt,
  staffUserId,
  remarks,
}) {
  return execute(
    `INSERT INTO promotion_receipts (id, promotion_id, campaign_participation_id, status, received_at, staff_user_id, remarks, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      id,
      promotionId,
      campaignParticipationId,
      status,
      receivedAt,
      staffUserId,
      remarks,
    ],
  );
}
