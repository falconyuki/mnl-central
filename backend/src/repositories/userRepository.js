import { execute } from "../database/database.js";

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
