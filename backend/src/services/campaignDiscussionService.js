import { randomUUID } from "node:crypto";

import {
  findCampaignDiscussionById,
  findCampaignDiscussionByCallAndParticipation,
  listCampaignDiscussions as listCampaignDiscussionsRepository,
  createCampaignDiscussion as createCampaignDiscussionRepository,
} from "../repositories/campaignDiscussionRepository.js";

import { findCallAttemptById } from "../repositories/callAttemptRepository.js";
import { findCampaignParticipationById } from "../repositories/campaignParticipationRepository.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const DISCUSSION_STATUSES = new Set(["DISCUSSED", "NOT_DISCUSSED"]);

function normalizeRequiredString(value) {
  return value.trim();
}

function normalizeNullableString(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();

  return normalized === "" ? null : normalized;
}

export async function getCampaignDiscussionById(id) {
  return findCampaignDiscussionById(id);
}

export async function listCampaignDiscussions({
  page = 1,
  pageSize = 20,
  discussionStatus = null,
  callAttemptId = null,
  campaignParticipationId = null,
  websiteIds = null,
}) {
  return listCampaignDiscussionsRepository({
    page,
    pageSize,
    discussionStatus,
    callAttemptId,
    campaignParticipationId,
    websiteIds,
  });
}

export async function createCampaignDiscussion({
  callAttemptId,
  campaignParticipationId,
  discussionStatus,
  remarks = null,
}) {
  const normalizedCallAttemptId = normalizeRequiredString(callAttemptId);

  const normalizedCampaignParticipationId = normalizeRequiredString(
    campaignParticipationId,
  );

  const normalizedRemarks = normalizeNullableString(remarks);

  if (!DISCUSSION_STATUSES.has(discussionStatus)) {
    throw new AppError("Invalid discussion status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        field: "discussionStatus",
        allowedValues: [...DISCUSSION_STATUSES],
      },
    });
  }

  const callAttempt = await findCallAttemptById(normalizedCallAttemptId);

  if (!callAttempt) {
    throw new AppError("Call attempt not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Call Attempt",
        id: normalizedCallAttemptId,
      },
    });
  }

  const campaignParticipation = await findCampaignParticipationById(
    normalizedCampaignParticipationId,
  );

  if (!campaignParticipation) {
    throw new AppError("Campaign participation not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign Participation",
        id: normalizedCampaignParticipationId,
      },
    });
  }

  if (callAttempt.customer_id !== campaignParticipation.customer_id) {
    throw new AppError(
      "Call attempt and campaign participation must belong to the same customer.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "CampaignDiscussion",
          callAttemptId: normalizedCallAttemptId,
          campaignParticipationId: normalizedCampaignParticipationId,
        },
      },
    );
  }

  const existingDiscussion = await findCampaignDiscussionByCallAndParticipation(
    normalizedCallAttemptId,
    normalizedCampaignParticipationId,
  );

  if (existingDiscussion) {
    throw new AppError("Campaign discussion already exists.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "CampaignDiscussion",
        callAttemptId: normalizedCallAttemptId,
        campaignParticipationId: normalizedCampaignParticipationId,
      },
    });
  }

  const id = randomUUID();

  await createCampaignDiscussionRepository({
    id,
    callAttemptId: normalizedCallAttemptId,
    campaignParticipationId: normalizedCampaignParticipationId,
    discussionStatus,
    remarks: normalizedRemarks,
  });

  return findCampaignDiscussionById(id);
}
