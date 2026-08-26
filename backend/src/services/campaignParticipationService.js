import { randomUUID } from "node:crypto";
import {
  findCampaignParticipationById,
  findCampaignParticipationByCampaignAndCustomer,
  listCampaignParticipations as listCampaignParticipationsRepository,
  createCampaignParticipation as createCampaignParticipationRepository,
  updateCampaignParticipationStatus as updateCampaignParticipationStatusRepository,
} from "../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../repositories/campaignRepository.js";
import { findCustomerById } from "../repositories/customerRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const ACTIVE_STATUS = "Active";
const EXPIRED_STATUS = "Expired";
const PARTICIPATION_STATUSES = new Set([ACTIVE_STATUS, EXPIRED_STATUS]);

function normalizeRequiredString(value) {
  return value.trim();
}

export async function getCampaignParticipationById(id) {
  return findCampaignParticipationById(id);
}

export async function listCampaignParticipations({
  page = 1,
  pageSize = 20,
  status = null,
  campaignId = null,
  customerId = null,
  websiteIds = null,
}) {
  return listCampaignParticipationsRepository({
    page,
    pageSize,
    status,
    campaignId,
    customerId,
    websiteIds,
  });
}

export async function createCampaignParticipation({ campaignId, customerId }) {
  const normalizedCampaignId = normalizeRequiredString(campaignId);
  const normalizedCustomerId = normalizeRequiredString(customerId);

  const campaign = await findCampaignById(normalizedCampaignId);
  if (!campaign) {
    throw new AppError("Campaign not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign",
        id: normalizedCampaignId,
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

  if (campaign.websiteId !== customer.websiteId) {
    throw new AppError(
      "Customer and campaign must belong to the same website.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "CampaignParticipation",
          campaignId: normalizedCampaignId,
          customerId: normalizedCustomerId,
        },
      },
    );
  }

  const existingParticipation =
    await findCampaignParticipationByCampaignAndCustomer(
      normalizedCampaignId,
      normalizedCustomerId,
    );
  if (existingParticipation) {
    return existingParticipation;
  }

  const id = randomUUID();
  await createCampaignParticipationRepository({
    id,
    campaignId: normalizedCampaignId,
    customerId: normalizedCustomerId,
    status: ACTIVE_STATUS,
  });

  return findCampaignParticipationById(id);
}

export async function updateCampaignParticipationStatus(id, status) {
  const normalizedId = normalizeRequiredString(id);

  if (!PARTICIPATION_STATUSES.has(status)) {
    throw new AppError("Invalid campaign participation status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        field: "status",
        allowedValues: [...PARTICIPATION_STATUSES],
      },
    });
  }

  const existingParticipation =
    await findCampaignParticipationById(normalizedId);
  if (!existingParticipation) {
    throw new AppError("Campaign participation not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign Participation",
        id: normalizedId,
      },
    });
  }

  if (existingParticipation.status === status) {
    return existingParticipation;
  }

  await updateCampaignParticipationStatusRepository({
    id: normalizedId,
    status,
  });
  return findCampaignParticipationById(normalizedId);
}
