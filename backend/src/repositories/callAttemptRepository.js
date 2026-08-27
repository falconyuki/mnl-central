import { execute } from "../database/database.js";

export async function findCallAttemptById(id) {
  const result = await execute(
    `SELECT id, customer_id AS customerId, user_id AS userId, called_at AS calledAt, call_status AS callStatus, remarks, created_at AS createdAt, updated_at AS updatedAt
        FROM call_attempts WHERE id = ? LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function listCallAttempts({
  page = 1,
  pageSize = 20,
  callStatus = null,
  customerId = null,
  userId = null,
  websiteIds = null,
}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (callStatus) {
    conditions.push(`ca.call_status = ?`);
    parameters.push(callStatus);
  }

  if (customerId) {
    conditions.push(`ca.customer_id = ?`);
    parameters.push(customerId);
  }

  if (userId) {
    conditions.push(`ca.user_id = ?`);
    parameters.push(userId);
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

  const fromClause = `
    FROM call_attempts ca
    INNER JOIN customers c ON c.id = ca.customer_id
    ${whereClause}
  `;

  const countResult = await execute(
    `SELECT COUNT(*) AS total ${fromClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT
        ca.id,
        ca.customer_id AS customerId,
        ca.user_id AS userId,
        ca.called_at AS calledAt,
        ca.call_status AS callStatus,
        ca.remarks,
        ca.created_at AS createdAt,
        ca.updated_at AS updatedAt
      ${fromClause}
      ORDER BY ca.called_at DESC, ca.id ASC
      LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createCallAttempt(
  { id, customerId, userId, calledAt, callStatus, remarks },
  transaction = null,
) {
  const executor = transaction ?? { execute };
  return executor.execute(
    `INSERT INTO call_attempts (
        id,
        customer_id,
        user_id,
        called_at,
        call_status,
        remarks,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, customerId, userId, calledAt, callStatus, remarks],
  );
}
