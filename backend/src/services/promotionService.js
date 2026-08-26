import { randomUUID } from "node:crypto";
import {
  findPromotionById,
  listPromotions as listPromotionsRepository,
  createPromotion as createPromotionRepository,
  updatePromotion as updatePromotionRepository,
  updatePromotionStatus as updatePromotionStatusRepository,
} from "../repositories/promotionRepository.js";
import { findCampaignById } from "../repositories/campaignRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const PROMOTION_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

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

export async function getPromotionById(id) {
  return findPromotionById(id);
}

export async function listPromotions({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  campaignId = null,
}) {
  const normalizedSearch =
    search === null || search === undefined
      ? null
      : normalizeRequiredString(search);

  const normalizedCampaignId =
    campaignId === null || campaignId === undefined
      ? null
      : normalizeRequiredString(campaignId);

  return listPromotionsRepository({
    page,
    pageSize,
    search: normalizedSearch || null,
    status,
    campaignId: normalizedCampaignId,
  });
}

export async function createPromotion({
  campaignId,
  name,
  description = null,
  amount = null,
  status = PROMOTION_STATUS.ACTIVE,
}) {
  const normalizedCampaignId = normalizeRequiredString(campaignId);
  const normalizedName = normalizeRequiredString(name);
  const normalizedDescription = normalizeNullableString(description);

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

  if (
    status !== PROMOTION_STATUS.ACTIVE &&
    status !== PROMOTION_STATUS.INACTIVE
  ) {
    throw new AppError("Invalid status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        resource: "Promotion",
        field: "status",
        value: status,
      },
    });
  }

  const id = randomUUID();
  await createPromotionRepository({
    id,
    campaignId: normalizedCampaignId,
    name: normalizedName,
    description: normalizedDescription,
    amount,
    status,
  });

  return findPromotionById(id);
}

export async function updatePromotion(
  id,
  { name, description = null, amount = null },
) {
  const existingPromotion = await findPromotionById(id);
  if (!existingPromotion) {
    throw new AppError("Promotion not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Promotion",
        id,
      },
    });
  }

  const normalizedName = normalizeRequiredString(name);
  const normalizedDescription = normalizeNullableString(description);

  await updatePromotionRepository({
    id,
    name: normalizedName,
    description: normalizedDescription,
    amount,
  });

  return findPromotionById(id);
}

export async function updatePromotionStatus(id, status) {
  const existingPromotion = await findPromotionById(id);
  if (!existingPromotion) {
    throw new AppError("Promotion not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Promotion",
        id,
      },
    });
  }

  if (
    status !== PROMOTION_STATUS.ACTIVE &&
    status !== PROMOTION_STATUS.INACTIVE
  ) {
    throw new AppError("Invalid status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        resource: "Promotion",
        field: "status",
        value: status,
      },
    });
  }

  if (existinePromotion.status === status) {
    return existingPromotion;
  }

  await updatePromotionStatusRepository(id, status);
  return findPromotionById(id);
}
