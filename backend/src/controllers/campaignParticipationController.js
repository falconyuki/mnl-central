import {
  getCampaignParticipationAuthorization,
  authorizeCampaignParticipationList,
  authorizeCampaignParticipationView,
  authorizeCampaignParticipationCreate,
  authorizeCampaignParticipationStatusUpdate,
  getAuthorizedCampaignParticipationWebsiteIds,
} from "../services/authorizations/campaignParticipationAuthorizationService.js";

import {
  getCampaignParticipationById,
  listCampaignParticipations,
  createCampaignParticipation,
  updateCampaignParticipationStatus,
} from "../services/campaignParticipationService.js";

import { getCampaignById } from "../services/campaignService.js";

export async function getCampaignParticipations(req, res, next) {
  try {
    const authorizationContext = await getCampaignParticipationAuthorization(
      req.user,
    );
    authorizeCampaignParticipationList(authorizationContext);
    const websiteIds =
      getAuthorizedCampaignParticipationWebsiteIds(authorizationContext);

    const result = await listCampaignParticipations({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      status: req.query.status ?? null,
      campaignId: req.query.campaignId ?? null,
      customerId: req.query.customerId ?? null,
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

export async function getCampaignParticipation(req, res, next) {
  try {
    const participation = await getCampaignParticipationById(req.params.id);

    if (!participation) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign participation not found",
        },
      });
    }

    const campaign = await getCampaignById(participation.campaignId);

    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignParticipationAuthorization(
      req.user,
    );

    authorizeCampaignParticipationView(
      authorizationContext,
      campaign.websiteId,
    );

    return res.status(200).json({
      data: participation,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCampaignParticipation(req, res, next) {
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

    const authorizationContext = await getCampaignParticipationAuthorization(
      req.user,
    );

    authorizeCampaignParticipationCreate(
      authorizationContext,
      campaign.websiteId,
    );

    const participation = await createCampaignParticipation({
      campaignId: req.body.campaignId,
      customerId: req.body.customerId,
    });

    return res.status(201).json({
      data: participation,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchCampaignParticipationStatus(req, res, next) {
  try {
    const participation = await getCampaignParticipationById(req.params.id);

    if (!participation) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign participation not found",
        },
      });
    }

    const campaign = await getCampaignById(participation.campaignId);

    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignParticipationAuthorization(
      req.user,
    );

    authorizeCampaignParticipationStatusUpdate(
      authorizationContext,
      campaign.websiteId,
    );

    const updatedParticipation = await updateCampaignParticipationStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      data: updatedParticipation,
    });
  } catch (error) {
    return next(error);
  }
}
