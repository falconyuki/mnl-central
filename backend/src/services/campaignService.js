import { randomUUID } from "node:crypto";
import { withTransaction } from "../database/database.js";
import {
  findCampaignById,
  listCampaigns as listCampaignsRepository,
  createCampaign as createCampaignRepository,
  updateCampaign as updateCampaignRepository,
  updateCampaignStatus as updateCampaignStatusRepository,
} from "../repositories/campaignRepository.js";
import { findWebsiteById } from "../repositories/websiteRepository.js";
import { createPromotion } from "../repositories/promotionRepository.js";
import { expireActiveCampaignParticipations } from "../repositories/campaignParticipationRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const CAMPAIGN_STATUS = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

function normalizeRequiredString(value) {
  return value.trim();
}

function normalizeDate(value) {
  return normalizeRequiredString(value);
}

function normalizeNullableString(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

function validateDateRange(startDate, endDate) {
  if (endDate < startDate) {
    throw new AppError("End date must be after start date.", {
      code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
      statusCode: 400,
      details: {
        resource: "Campaign",
        field: "end_date",
        startDate,
        endDate,
      },
    });
  }
}

function validateCampaignStatus(status) {
  if (!Object.values(CAMPAIGN_STATUS).includes(status)) {
    throw new AppError("Invalid status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        resource: "Campaign",
        field: "status",
        value: status,
      },
    });
  }
}

function validateStatusTransition(status, nextStatus) {
  if (status === nextStatus) {
    return;
  }

  const allowedTransitions = {
    [CAMPAIGN_STATUS.DRAFT]: new Set([
      CAMPAIGN_STATUS.ACTIVE,
      CAMPAIGN_STATUS.CANCELLED,
    ]),
    [CAMPAIGN_STATUS.ACTIVE]: new Set([
      CAMPAIGN_STATUS.EXPIRED,
      CAMPAIGN_STATUS.CANCELLED,
    ]),
    [CAMPAIGN_STATUS.EXPIRED]: new Set(),
    [CAMPAIGN_STATUS.CANCELLED]: new Set(),
  };

  if (!allowedTransitions[status]?.has(nextStatus)) {
    throw new AppError(
      `Invalid campaign status transition from ${status} to ${nextStatus}.`,
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "Campaign",
          field: "status",
          currentStatus: status,
          nextStatus,
        },
      },
    );
  }
}

export async function getCampaignById(id) {
  return findCampaignById(id);
}

export async function listCampaigns({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  websiteIds = null,
}) {
  const normalizedSearch =
    search === null || search === undefined
      ? null
      : normalizeRequiredString(search);

  return listCampaignsRepository({
    page,
    pageSize,
    search: normalizedSearch || null,
    status,
    websiteIds,
  });
}

export async function createCampaign({
  websiteId,
  name,
  description = null,
  startDate,
  endDate,
  status = CAMPAIGN_STATUS.DRAFT,
  createdBy,
  promotion,
}) {
  const normalizedWebsiteId = normalizeRequiredString(websiteId);
  const normalizedName = normalizeRequiredString(name);
  const normalizedDescription = normalizeNullableString(description);
  const normalizedStartDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);
  const normalizedCreatedBy = normalizeRequiredString(createdBy);

  validateCampaignStatus(status);
  validateDateRange(normalizedStartDate, normalizedEndDate);

  const website = await findWebsiteById(normalizedWebsiteId);
  if (!website) {
    throw new AppError("Website not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Website",
        id: normalizedWebsiteId,
      },
    });
  }

  const campaignId = randomUUID();
  const promotionId = randomUUID();
  const campaign = await withTransaction(async (transaction) => {
    await createCampaignRepository(
      {
        id: campaignId,
        websiteId: normalizedWebsiteId,
        name: normalizedName,
        description: normalizedDescription,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        status: status ?? CAMPAIGN_STATUS.DRAFT,
        createdBy: normalizedCreatedBy,
      },
      transaction,
    );

    await createPromotion(
      {
        id: promotionId,
        campaignId,
        name: promotion.name,
        description: promotion.description ?? null,
        amount: promotion.amount ?? null,
        status: promotion.status ?? "Active",
      },
      transaction,
    );

    return {
      id: campaignId,
      websiteId: normalizedWebsiteId,
      name: normalizedName,
      description: normalizedDescription ?? null,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      status: status ?? CAMPAIGN_STATUS.DRAFT,
      createdBy: normalizedCreatedBy,
    };
  });
  return campaign;
}

export async function updateCampaign(
  id,
  { name, description = null, startDate, endDate },
) {
  const existingCampaign = await findCampaignById(id);
  if (!existingCampaign) {
    throw new AppError("Campaign not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign",
        id,
      },
    });
  }

  const normalizedName = normalizeRequiredString(name);
  const normalizedDescription = normalizeNullableString(description);
  const normalizedStartDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);

  validateDateRange(normalizedStartDate, normalizedEndDate);

  if (
    existingCampaign.status === CAMPAIGN_STATUS.EXPIRED ||
    existingCampaign.status === CAMPAIGN_STATUS.CANCELLED
  ) {
    throw new AppError(
      `Campaign cannot be updated while its status is ${existingCampaign.status}.`,
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "Campaign",
          id,
          status: existingCampaign.status,
        },
      },
    );
  }

  await updateCampaignRepository({
    id,
    name: normalizedName,
    description: normalizedDescription,
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
  });

  return findCampaignById(id);
}

export async function updateCampaignStatus(id, status) {
  const existingCampaign = await findCampaignById(id);
  if (!existingCampaign) {
    throw new AppError("Campaign not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign",
        id,
      },
    });
  }

  validateCampaignStatus(status);
  validateStatusTransition(existingCampaign.status, status);

  if (existingCampaign.status === status) {
    return existingCampaign;
  }

  const shouldExpireParticipations =
    status === CAMPAIGN_STATUS.EXPIRED || status === CAMPAIGN_STATUS.CANCELLED;
  if (shouldExpireParticipations) {
    await withTransaction(async (transaction) => {
      await updateCampaignStatusRepository(id, status, transaction);
      await expireActiveCampaignParticipations(id, transaction);
    });
  } else {
    await updateCampaignStatusRepository(id, status);
  }
  return findCampaignById(id);
}
