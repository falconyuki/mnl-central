import { execute } from "../database/database.js";

export async function findCustomerById(id) {
  const result = await execute(
    `SELECT id, website_id, username, name, phone, status, created_at, updated_at
        FROM customers WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findCustomerByWebsiteAndUsername(websiteId, username) {
  const result = await execute(
    `SELECT id, website_id, username, name, phone, status, created_at, updated_at
        FROM customers WHERE website_id = ? AND username = ? LIMIT 1`,
    [websiteId, username],
  );
  return result.rows[0] ?? null;
}

export async function listCustomers({
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
    conditions.push(`(username LIKE ? OR name LIKE ? OR phone LIKE ?)`);
    const searchPattern = `%${search}%`;
    parameters.push(searchPattern, searchPattern, searchPattern);
  }

  if (status) {
    conditions.push(`status = ?`);
    parameters.push(status);
  }

  if (websiteIds !== null) {
    if (websiteIds.length === 0) {
      return {
        rows: [],
        count: 0,
      };
    }
    const placeholder = websiteIds.map(() => `?`).join(",");
    conditions.push(`website_id IN (${placeholder})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await execute(
    `SELECT COUNT(*) AS total FROM customers ${whereClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT id, website_id, username, name, phone, status, created_at, updated_at FROM customers ${whereClause} ORDER BY name ASC, username ASC LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    count: Number(countResult.rows[0].total),
  };
}

export async function createCustomer({
  id,
  websiteId,
  username,
  name,
  phone,
  status,
}) {
  return execute(
    `INSERT INTO customers (id, website_id, username, name, phone, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, websiteId, username, name, phone, status],
  );
}

export async function updateCustomer({ id, name, phone }) {
  return execute(
    `UPDATE customers SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, phone, id],
  );
}

export async function updateCustomerStatus(id, status) {
  return execute(
    `UPDATE customers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
  );
}
