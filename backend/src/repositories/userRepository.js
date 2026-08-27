import { execute } from "../database/database.js";

function mapUserForManagement(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    roleId: row.role_id,
    roleName: row.role_name,
    status: row.status,
    mustChangePassword: Boolean(row.must_change_password),
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findUserByUsername(username) {
  const result = await execute(
    `
        SELECT
            u.id,
            u.username,
            u.display_name,
            u.password_hash,
            u.role_id,
            u.status,
            u.must_change_password,
            u.last_login_at,
            u.created_at,
            u.updated_at,

            r.name AS role_name,
            r.description AS role_description
        
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.username = ?
        LIMIT 1
    `,
    [username],
  );

  return result.rows[0] ?? null;
}

export async function findUserById(userId) {
  const result = await execute(
    `
        SELECT
            u.id,
            u.username,
            u.display_name,
            u.password_hash,
            u.role_id,
            u.status,
            u.must_change_password,
            u.last_login_at,
            u.created_at,
            u.updated_at,

            r.name AS role_name,
            r.description AS role_description
        
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = ?
        LIMIT 1
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function updateLastLogin(userId, lastLoginAt) {
  await execute(
    `
        UPDATE users
        SET last_login_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `,
    [lastLoginAt, userId],
  );
}

export async function updatePassword(userId, passwordHash, mustChangePassword) {
  await execute(
    `
        UPDATE users
        SET password_hash = ?, must_change_password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `,
    [passwordHash, mustChangePassword ? 1 : 0, userId],
  );
}

export async function findUserWebsiteAccess(userId) {
  const result = await execute(
    `
        SELECT
            uwa.id,
            uwa.user_id,
            uwa.website_id,
            w.name AS website_name,
            w.code AS website_code,
            w.status AS website_status
        FROM user_website_access uwa
        INNER JOIN websites w ON w.id = uwa.website_id
        WHERE uwa.user_id = ?
        ORDER BY w.name ASC
    `,
    [userId],
  );

  return result.rows;
}

export async function findUserForManagementById(userId) {
  const result = await execute(
    `
      SELECT
          u.id,
          u.username,
          u.display_name,
          u.role_id,
          r.name AS role_name,
          u.status,
          u.must_change_password,
          u.last_login_at,
          u.created_at,
          u.updated_at
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      LIMIT 1
    `,
    [userId],
  );

  return mapUserForManagement(result.rows[0] ?? null);
}

export async function listUsers({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  roleId = null,
} = {}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (search) {
    conditions.push(`(u.username LIKE ? OR u.display_name LIKE ?)`);

    const searchPattern = `%${search}%`;
    parameters.push(searchPattern, searchPattern);
  }

  if (status) {
    conditions.push(`u.status = ?`);
    parameters.push(status);
  }

  if (roleId) {
    conditions.push(`u.role_id = ?`);
    parameters.push(roleId);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await execute(
    `
      SELECT COUNT(*) AS total
      FROM users u
      ${whereClause}
    `,
    parameters,
  );

  const result = await execute(
    `
      SELECT
          u.id,
          u.username,
          u.display_name,
          u.role_id,
          r.name AS role_name,
          u.status,
          u.must_change_password,
          u.last_login_at,
          u.created_at,
          u.updated_at
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      ${whereClause}
      ORDER BY u.display_name ASC, u.username ASC
      LIMIT ? OFFSET ?
    `,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows.map(mapUserForManagement),
    total: Number(countResult.rows[0].total),
  };
}

export async function createUser({
  id,
  username,
  displayName,
  passwordHash,
  roleId,
  status,
  mustChangePassword,
  createdAt,
  updatedAt,
}) {
  await execute(
    `
      INSERT INTO users (
        id,
        username,
        display_name,
        password_hash,
        role_id,
        status,
        must_change_password,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      username,
      displayName,
      passwordHash,
      roleId,
      status,
      mustChangePassword ? 1 : 0,
      createdAt,
      updatedAt,
    ],
  );
}
