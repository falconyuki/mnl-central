import { execute } from "../database/database.js";

export async function listUserWebsiteAccess(userId) {
  const result = await execute(
    `
      SELECT
        uwa.id,
        uwa.user_id AS userId,
        uwa.website_id AS websiteId,
        w.name AS websiteName,
        w.code AS websiteCode,
        w.status AS websiteStatus,
        uwa.created_at AS createdAt
      FROM user_website_access uwa
      INNER JOIN websites w
        ON w.id = uwa.website_id
      WHERE uwa.user_id = ?
      ORDER BY w.name ASC
    `,
    [userId],
  );

  return result.rows;
}

export async function createUserWebsiteAccess({
  id,
  userId,
  websiteId,
  createdAt,
}) {
  await execute(
    `
      INSERT INTO user_website_access (
        id,
        user_id,
        website_id,
        created_at
      )
      VALUES (?, ?, ?, ?)
    `,
    [id, userId, websiteId, createdAt],
  );
}

export async function deleteUserWebsiteAccess({ userId, websiteId }) {
  const result = await execute(
    `
      DELETE FROM user_website_access
      WHERE user_id = ?
        AND website_id = ?
    `,
    [userId, websiteId],
  );

  return result.changes;
}
