import { randomUUID } from "node:crypto";
import {
  findPromotionReceiptById,
  findPromotionReceiptByPromotionAndParticipation,
  listPromotionReceipts as listPromotionReceiptsRepository,
  createPromotionReceipt as createPromotionReceiptRepository,
} from "../repositories/promotionReceiptRepository.js";
import { findPromotionById } from "../repositories/promotionRepository.js";
import { findCampaignParticipationById } from "../repositories/campaignParticipationRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const PROMOTION_RECEIPT_STATUS = "RECEIVED";

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

export async function getPromotionReceiptById(id) {
  return findPromotionReceiptById(id);
}

export async function listPromotionReceipts({
  page = 1,
  pageSize = 20,
  status = null,
  promotionId = null,
  campaignParticipationId = null,
  staffUserId = null,
  websiteIds = null,
}) {
  const normalizedPromotionId =
    promotionId === null || promotionId === undefined
      ? null
      : normalizeRequiredString(promotionId);

  const normalizedCampaignParticipationId =
    campaignParticipationId === null || campaignParticipationId === undefined
      ? null
      : normalizeRequiredString(campaignParticipationId);

  const normalizedStaffUserId =
    staffUserId === null || staffUserId === undefined
      ? null
      : normalizeRequiredString(staffUserId);

  return listPromotionReceiptsRepository({
    page,
    pageSize,
    status,
    promotionId: normalizedPromotionId || null,
    campaignParticipationId: normalizedCampaignParticipationId || null,
    staffUserId: normalizedStaffUserId || null,
    websiteIds,
  });
}

export async function createPromotionReceipt({
  promotionId,
  campaignParticipationId,
  staffUserId,
  remarks = null,
}) {
  const normalizedPromotionId = normalizeRequiredString(promotionId);
  const normalizedCampaignParticipationId = normalizeRequiredString(
    campaignParticipationId,
  );
  const normalizedStaffUserId = normalizeRequiredString(staffUserId);
  const normalizedRemarks = normalizeNullableString(remarks);

  const promotion = await findPromotionById(normalizedPromotionId);
  if (!promotion) {
    throw new AppError("Promotion not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Promotion",
        id: normalizedPromotionId,
      },
    });
  }

  const participation = await findCampaignParticipationById(
    normalizedCampaignParticipationId,
  );
  if (!participation) {
    throw new AppError("Campaign participation not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Campaign Participation",
        id: normalizedCampaignParticipationId,
      },
    });
  }

  if (promotion.campaignId !== participation.campaignId) {
    throw new AppError(
      "Promotion and campaign participation must belong to the same campaign.",
      {
        code: ERROR_CODES.BUSINESS_RULE_VIOLATION,
        statusCode: 400,
        details: {
          resource: "PromotionReceipt",
          promotionId: normalizedPromotionId,
          campaignParticipationId: normalizedCampaignParticipationId,
        },
      },
    );
  }

  const existingReceipt = await findPromotionReceiptByPromotionAndParticipation(
    normalizedPromotionId,
    normalizedCampaignParticipationId,
  );
  if (existingReceipt) {
    throw new AppError(
      "Promotion has already been received for this campaign participation.",
      {
        code: ERROR_CODES.CONFLICT,
        statusCode: 409,
        details: {
          resource: "PromotionReceipt",
          promotionId: normalizedPromotionId,
          campaignParticipationId: normalizedCampaignParticipationId,
        },
      },
    );
  }

  const id = randomUUID();
  const receivedAt = new Date().toISOString();

  await createPromotionReceiptRepository({
    id,
    promotionId: normalizedPromotionId,
    campaignParticipationId: normalizedCampaignParticipationId,
    status: PROMOTION_RECEIPT_STATUS,
    receivedAt,
    staffUserId: normalizedStaffUserId,
    remarks: normalizedRemarks,
  });

  return findPromotionReceiptById(id);
}
