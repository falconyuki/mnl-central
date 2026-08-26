import {
  getCampaignAuthorization,
  authorizeCampaignView,
  authorizeCampaignCreate,
  authorizeCampaignUpdate,
  authorizeCampaignStatusUpdate,
  getAuthorizedCampaignWebsiteIds,
} from "../services/authorizations/campaignAuthorizationService.js";
import {
  getCampaignById,
  listCampaigns,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
} from "../services/campaignService.js";

export async function getCampaigns(req, res, next) {
  try {
    const authorizationContext = await getCampaignAuthorization(req.user);
    const websiteIds = getAuthorizedCampaignWebsiteIds(authorizationContext);

    const result = await listCampaigns({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      search: req.query.search ?? null,
      status: req.query.status ?? null,
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

export async function getCampaign(req, res, next) {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignAuthorization(req.user);
    authorizeCampaignView(authorizationContext, campaign.websiteId);

    return res.status(200).json({
      data: campaign,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCampaign(req, res, next) {
  try {
    const authorizationContext = await getCampaignAuthorization(req.user);
    authorizeCampaignCreate(authorizationContext, req.body.websiteId);

    const campaign = await createCampaign({
      websiteId: req.body.websiteId,
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      data: campaign,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchCampaign(req, res, next) {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignAuthorization(req.user);
    authorizeCampaignUpdate(authorizationContext, campaign.websiteId);

    const updatedCampaign = await updateCampaign(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return res.status(200).json({
      data: updatedCampaign,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchCampaignStatus(req, res, next) {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignAuthorization(req.user);
    authorizeCampaignStatusUpdate(authorizationContext, campaign.websiteId);

    const updatedCampaign = await updateCampaignStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      data: updatedCampaign,
    });
  } catch (error) {
    return next(error);
  }
}
