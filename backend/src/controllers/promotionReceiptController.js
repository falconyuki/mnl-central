import {
  getPromotionReceiptAuthorization,
  authorizePromotionReceiptView,
  authorizePromotionReceiptCreate,
  getAuthorizedPromotionReceiptWebsiteIds,
} from "../services/authorizations/promotionReceiptAuthorizationService.js";

import {
  getPromotionReceiptById,
  listPromotionReceipts,
  createPromotionReceipt,
} from "../services/promotionReceiptService.js";

import { getPromotionById } from "../services/promotionService.js";
import { getCampaignById } from "../services/campaignService.js";

export async function getPromotionReceipts(req, res, next) {
  try {
    const authorizationContext = await getPromotionReceiptAuthorization(
      req.user,
    );

    const websiteIds =
      getAuthorizedPromotionReceiptWebsiteIds(authorizationContext);

    const result = await listPromotionReceipts({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      status: req.query.status ?? null,
      promotionId: req.query.promotionId ?? null,
      campaignParticipationId: req.query.campaignParticipationId ?? null,
      staffUserId: req.query.staffUserId ?? null,
      websiteIds,
    });

    return res.status(200).json({
      data: result.rows,
      pagination: {
        page: Number(req.query.page ?? 1),
        pageSize: Number(req.query.pageSize ?? 20),
        total: result.total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function postPromotionReceipt(req, res, next) {
  try {
    const promotion = await getPromotionById(req.body.promotionId);

    if (!promotion) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Promotion not found",
        },
      });
    }

    const campaign = await getCampaignById(promotion.campaignId);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getPromotionReceiptAuthorization(
      req.user,
    );

    authorizePromotionReceiptCreate(authorizationContext, campaign.websiteId);

    const receipt = await createPromotionReceipt({
      promotionId: req.body.promotionId,
      campaignParticipationId: req.body.campaignParticipationId,
      staffUserId: req.user.id,
      remarks: req.body.remarks ?? null,
    });

    return res.status(201).json({
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPromotionReceipt(req, res, next) {
  try {
    const receipt = await getPromotionReceiptById(req.params.id);
    if (!receipt) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Promotion receipt not found",
        },
      });
    }

    const promotion = await getPromotionById(receipt.promotionId);
    if (!promotion) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Promotion not found",
        },
      });
    }
    const campaign = await getCampaignById(promotion.campaignId);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getPromotionReceiptAuthorization(
      req.user,
    );

    authorizePromotionReceiptView(authorizationContext, campaign.websiteId);

    return res.status(200).json({
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}
