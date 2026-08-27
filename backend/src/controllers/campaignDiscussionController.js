import {
  getCampaignDiscussionAuthorization,
  authorizeCampaignDiscussionView,
  authorizeCampaignDiscussionCreate,
  getAuthorizedCampaignDiscussionWebsiteIds,
} from "../services/authorizations/campaignDiscussionAuthorizationService.js";

import {
  getCampaignDiscussionAuthorizationData,
  resolveCampaignDiscussionContext,
  listCampaignDiscussions,
  createCampaignDiscussion,
} from "../services/campaignDiscussionService.js";

export async function getCampaignDiscussions(req, res, next) {
  try {
    const authorizationContext = await getCampaignDiscussionAuthorization(
      req.user,
    );

    const websiteIds =
      getAuthorizedCampaignDiscussionWebsiteIds(authorizationContext);

    const result = await listCampaignDiscussions({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      discussionStatus: req.query.discussionStatus ?? null,
      callAttemptId: req.query.callAttemptId ?? null,
      campaignParticipationId: req.query.campaignParticipationId ?? null,
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

export async function getCampaignDiscussion(req, res, next) {
  try {
    const authorizationData = await getCampaignDiscussionAuthorizationData(
      req.params.id,
    );

    if (!authorizationData) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign discussion not found",
        },
      });
    }

    const authorizationContext = await getCampaignDiscussionAuthorization(
      req.user,
    );

    authorizeCampaignDiscussionView(
      authorizationContext,
      authorizationData.customer.websiteId,
    );

    return res.status(200).json({
      data: authorizationData.discussion,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCampaignDiscussion(req, res, next) {
  try {
    const authorizationContext = await getCampaignDiscussionAuthorization(
      req.user,
    );

    const discussionContext = await resolveCampaignDiscussionContext({
      callAttemptId: req.body.callAttemptId,
      campaignParticipationId: req.body.campaignParticipationId,
    });

    authorizeCampaignDiscussionCreate(
      authorizationContext,
      discussionContext.customer.websiteId,
    );

    const discussion = await createCampaignDiscussion({
      callAttemptId: req.body.callAttemptId,
      campaignParticipationId: req.body.campaignParticipationId,
      discussionStatus: req.body.discussionStatus,
      remarks: req.body.remarks,
    });

    return res.status(201).json({
      data: discussion,
    });
  } catch (error) {
    return next(error);
  }
}
