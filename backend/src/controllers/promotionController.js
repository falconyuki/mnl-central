import {
  getPromotionAuthorization,
  authorizePromotionView,
  authorizePromotionCreate,
  authorizePromotionUpdate,
  authorizePromotionStatusUpdate,
  getAuthorizedPromotionWebsiteIds,
} from "../services/authorizations/promotionAuthorizationService.js";
import {
  getPromotionById,
  listPromotions,
  createPromotion,
  updatePromotion,
  updatePromotionStatus,
} from "../services/promotionService.js";
import { getCampaignById } from "../services/campaignService.js";

export async function getPromotions(req, res, next) {
  try {
    const authorizationContext = await getPromotionAuthorization(req.user);
    const websiteIds = getAuthorizedPromotionWebsiteIds(authorizationContext);

    const result = await listPromotions({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      search: req.query.search ?? null,
      status: req.query.status ?? null,
      campaignId: req.query.campaignId ?? null,
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

export async function getPromotion(req, res, next) {
  try {
    const promotion = await getPromotionById(req.params.id);
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

    const authorizationContext = await getPromotionAuthorization(req.user);
    authorizePromotionView(authorizationContext, campaign.websiteId);

    return res.status(200).json({
      data: promotion,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postPromotion(req, res, next) {
  try {
    const campaign = await getCampaignById(req.body.campaignId);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getPromotionAuthorization(req.user);
    authorizePromotionCreate(authorizationContext, campaign.websiteId);

    const promotion = await createPromotion({
      campaignId: req.body.campaignId,
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      status: req.body.status,
    });

    return res.status(201).json({
      data: promotion,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchPromotion(req, res, next) {
  try {
    const promotion = await getPromotionById(req.params.id);
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

    const authorizationContext = await getPromotionAuthorization(req.user);
    authorizePromotionUpdate(authorizationContext, campaign.websiteId);

    const updatedPromotion = await updatePromotion(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
    });

    return res.status(200).json({
      data: updatedPromotion,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchPromotionStatus(req, res, next) {
  try {
    const promotion = await getPromotionById(req.params.id);
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

    const authorizationContext = await getPromotionAuthorization(req.user);
    authorizePromotionStatusUpdate(authorizationContext, campaign.websiteId);

    const updatedPromotion = await updatePromotionStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      data: updatedPromotion,
    });
  } catch (error) {
    return next(error);
  }
}
