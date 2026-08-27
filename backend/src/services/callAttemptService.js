import { randomUUID } from "node:crypto";
import { withTransaction } from "../database/database.js";
import {
  findCallAttemptById,
  listCallAttempts as listCallAttemptsRepository,
  createCallAttempt as createCallAttemptRepository,
} from "../repositories/callAttemptRepository.js";
import { findCustomerById } from "../repositories/customerRepository.js";
import { findCampaignParticipationById } from "../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../repositories/campaignRepository.js";
import {
  findCampaignDiscussionById,
  createCampaignDiscussion as createCampaignDiscussionRepository,
} from "../repositories/campaignDiscussionRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const CALL_STATUSES = new Set([
  "NO_ANSWER",
  "ANSWERED",
  "DROP_CALL",
  "INTERESTED",
  "NOT_INTERESTED",
  "CALL_BACK",
  "WRONG_NUMBER",
  "INVALID_NUMBER",
]);
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

export async function getCallAttemptById(id) {
  return findCallAttemptById(id);
}

export async function listCallAttempts({
  page = 1,
  pageSize = 20,
  callStatus = null,
  customerId = null,
  userId = null,
  websiteIds = null,
}) {
  const normalizedCustomerId =
    customerId === null || customerId === undefined
      ? null
      : normalizeRequiredString(customerId);

  const normalizedUserId =
    userId === null || userId === undefined
      ? null
      : normalizeRequiredString(userId);

  return listCallAttemptsRepository({
    page,
    pageSize,
    callStatus,
    customerId: normalizedCustomerId || null,
    userId: normalizedUserId || null,
    websiteIds,
  });
}

export async function createCallAttempt({
  customerId,
  userId,
  callStatus,
  remarks = null,
}) {
  const normalizedCustomerId = normalizeRequiredString(customerId);
  const normalizedUserId = normalizeRequiredString(userId);
  const normalizedRemarks = normalizeNullableString(remarks);

  if (!CALL_STATUSES.has(callStatus)) {
    throw new AppError("Invalid call status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        field: "callStatus",
        allowedValues: [...CALL_STATUSES],
      },
    });
  }

  const customer = await findCustomerById(normalizedCustomerId);

  if (!customer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id: normalizedCustomerId,
      },
    });
  }

  const id = randomUUID();
  const calledAt = new Date().toISOString();

  await createCallAttemptRepository({
    id,
    customerId: normalizedCustomerId,
    userId: normalizedUserId,
    calledAt,
    callStatus,
    remarks: normalizedRemarks,
  });

  return findCallAttemptById(id);
}

export async function createCallAttemptWithDiscussion({
  customerId,
  userId,
  callStatus,
  callRemarks = null,
  campaignParticipationId,
  discussionStatus,
  discussionRemarks = null,
}) {
  const normalizedCustomerId = normalizeRequiredString(customerId);
  const normalizedUserId = normalizeRequiredString(userId);
  const normalizedCampaignParticipationId = normalizeRequiredString(
    campaignParticipationId,
  );

  const normalizedCallRemarks = normalizeNullableString(callRemarks);
  const normalizedDiscussionRemarks =
    normalizeNullableString(discussionRemarks);

  if (!CALL_STATUSES.has(callStatus)) {
    throw new AppError("Invalid call status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        field: "callStatus",
        allowedValues: [...CALL_STATUSES],
      },
    });
  }

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

  const customer = await findCustomerById(normalizedCustomerId);

  if (!customer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id: normalizedCustomerId,
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

  if (campaignParticipation.customerId !== customer.id) {
    throw new AppError(
      "Customer and campaign participation must belong to the same customer.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "CallAttemptDiscussion",
          customerId: customer.id,
          campaignParticipationId: campaignParticipation.id,
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
          resource: "CallAttemptDiscussion",
          customerId: customer.id,
          campaignId: campaign.id,
        },
      },
    );
  }

  const callAttemptId = randomUUID();
  const discussionId = randomUUID();
  const calledAt = new Date().toISOString();

  await withTransaction(async (transaction) => {
    await createCallAttemptRepository(
      {
        id: callAttemptId,
        customerId: customer.id,
        userId: normalizedUserId,
        calledAt,
        callStatus,
        remarks: normalizedCallRemarks,
      },
      transaction,
    );

    await createCampaignDiscussionRepository(
      {
        id: discussionId,
        callAttemptId,
        campaignParticipationId: campaignParticipation.id,
        discussionStatus,
        remarks: normalizedDiscussionRemarks,
      },
      transaction,
    );
  });

  const callAttempt = await findCallAttemptById(callAttemptId);
  const discussion = await findCampaignDiscussionById(discussionId);

  return {
    callAttempt,
    discussion,
  };
}
