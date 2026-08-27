import { execute } from "../database/database.js";

export async function findCampaignDiscussionById(id) {
  const result = await execute(
    `SELECT
        id,
        call_attempt_id AS callAttemptId,
        campaign_participation_id AS campaignParticipationId,
        discussion_status AS discussionStatus,
        remarks,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM campaign_discussions
      WHERE id = ?
      LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function findCampaignDiscussionByCallAndParticipation(
  callAttemptId,
  campaignParticipationId,
) {
  const result = await execute(
    `SELECT
        id,
        call_attempt_id AS callAttemptId,
        campaign_participation_id AS campaignParticipationId,
        discussion_status AS discussionStatus,
        remarks,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM campaign_discussions
      WHERE call_attempt_id = ?
        AND campaign_participation_id = ?
      LIMIT 1`,
    [callAttemptId, campaignParticipationId],
  );

  return result.rows[0] ?? null;
}

export async function listCampaignDiscussions({
  page = 1,
  pageSize = 20,
  discussionStatus = null,
  callAttemptId = null,
  campaignParticipationId = null,
  websiteIds = null,
}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const parameters = [];

  if (discussionStatus) {
    conditions.push(`cd.discussion_status = ?`);
    parameters.push(discussionStatus);
  }

  if (callAttemptId) {
    conditions.push(`cd.call_attempt_id = ?`);
    parameters.push(callAttemptId);
  }

  if (campaignParticipationId) {
    conditions.push(`cd.campaign_participation_id = ?`);
    parameters.push(campaignParticipationId);
  }

  if (websiteIds !== null) {
    if (websiteIds.length === 0) {
      return {
        rows: [],
        total: 0,
      };
    }

    const placeholders = websiteIds.map(() => "?").join(", ");

    conditions.push(`c.website_id IN (${placeholders})`);
    parameters.push(...websiteIds);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const fromClause = `
    FROM campaign_discussions cd
    INNER JOIN call_attempts ca
      ON ca.id = cd.call_attempt_id
    INNER JOIN customers c
      ON c.id = ca.customer_id
    INNER JOIN campaign_participations cp
      ON cp.id = cd.campaign_participation_id
    INNER JOIN campaigns cam
      ON cam.id = cp.campaign_id
    ${whereClause}
  `;

  const countResult = await execute(
    `SELECT COUNT(*) AS total
      ${fromClause}`,
    parameters,
  );

  const result = await execute(
    `SELECT
        cd.id,
        cd.call_attempt_id AS callAttemptId,
        cd.campaign_participation_id AS campaignParticipationId,
        cd.discussion_status AS discussionStatus,
        cd.remarks,
        cd.created_at AS createdAt,
        cd.updated_at AS updatedAt
      ${fromClause}
      ORDER BY cd.created_at DESC, cd.id ASC
      LIMIT ? OFFSET ?`,
    [...parameters, pageSize, offset],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function createCampaignDiscussion({
  id,
  callAttemptId,
  campaignParticipationId,
  discussionStatus,
  remarks,
}) {
  return execute(
    `INSERT INTO campaign_discussions (
        id,
        call_attempt_id,
        campaign_participation_id,
        discussion_status,
        remarks,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, callAttemptId, campaignParticipationId, discussionStatus, remarks],
  );
}
