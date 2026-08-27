import { randomUUID } from "node:crypto";

import {
  findCampaignDiscussionById,
  findCampaignDiscussionByCallAndParticipation,
  listCampaignDiscussions as listCampaignDiscussionsRepository,
  createCampaignDiscussion as createCampaignDiscussionRepository,
} from "../repositories/campaignDiscussionRepository.js";

import { findCallAttemptById } from "../repositories/callAttemptRepository.js";
import { findCustomerById } from "../repositories/customerRepository.js";
import { findCampaignParticipationById } from "../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../repositories/campaignRepository.js";

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

async function resolveCampaignDiscussionRelationships({
  callAttemptId,
  campaignParticipationId,
}) {
  const callAttempt = await findCallAttemptById(callAttemptId);

  if (!callAttempt) {
    throw new AppError("Call attempt not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Call Attempt",
        id: callAttemptId,
      },
    });
  }

  const customer = await findCustomerById(callAttempt.customerId);

  if (!customer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id: callAttempt.customerId,
      },
    });
  }

  const campaignParticipation = await findCampaignParticipationById(
    campaignParticipationId,
  );

  if (!campaignParticipation) {
    throw new AppError("Campaign participation not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign Participation",
        id: campaignParticipationId,
      },
    });
  }

  if (callAttempt.customerId !== campaignParticipation.customerId) {
    throw new AppError(
      "Call attempt and campaign participation must belong to the same customer.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "CampaignDiscussion",
          callAttemptId,
          campaignParticipationId,
        },
      },
    );
  }

  const campaign = await findCampaignById(campaignParticipation.campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign",
        id: campaignParticipation.campaignId,
      },
    });
  }

  if (customer.websiteId !== campaign.websiteId) {
    throw new AppError(
      "Customer and campaign must belong to the same website.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "CampaignDiscussion",
          customerId: customer.id,
          campaignId: campaign.id,
        },
      },
    );
  }

  return {
    callAttempt,
    customer,
    campaignParticipation,
    campaign,
  };
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

  const { callAttempt, customer, campaignParticipation, campaign } =
    await resolveCampaignDiscussionRelationships({
      callAttemptId: normalizedCallAttemptId,
      campaignParticipationId: normalizedCampaignParticipationId,
    });

  const existingDiscussion = await findCampaignDiscussionByCallAndParticipation(
    callAttempt.id,
    campaignParticipation.id,
  );

  if (existingDiscussion) {
    throw new AppError("Campaign discussion already exists.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "CampaignDiscussion",
        callAttemptId: callAttempt.id,
        campaignParticipationId: campaignParticipation.id,
      },
    });
  }

  const id = randomUUID();

  await createCampaignDiscussionRepository({
    id,
    callAttemptId: callAttempt.id,
    campaignParticipationId: campaignParticipation.id,
    discussionStatus,
    remarks: normalizedRemarks,
  });

  return findCampaignDiscussionById(id);
}

export async function getCampaignDiscussionAuthorizationData(id) {
  const discussion = await findCampaignDiscussionById(id);

  if (!discussion) {
    return null;
  }

  const { customer } = await resolveCampaignDiscussionRelationships({
    callAttemptId: discussion.callAttemptId,
    campaignParticipationId: discussion.campaignParticipationId,
  });

  return {
    discussion,
    customer,
  };
}

export async function resolveCampaignDiscussionContext({
  callAttemptId,
  campaignParticipationId,
}) {
  const normalizedCallAttemptId = normalizeRequiredString(callAttemptId);

  const normalizedCampaignParticipationId = normalizeRequiredString(
    campaignParticipationId,
  );

  return resolveCampaignDiscussionRelationships({
    callAttemptId: normalizedCallAttemptId,
    campaignParticipationId: normalizedCampaignParticipationId,
  });
}
