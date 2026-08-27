import {
  getCampaignDiscussionAuthorization,
  authorizeCampaignDiscussionView,
  authorizeCampaignDiscussionCreate,
  getAuthorizedCampaignDiscussionWebsiteIds,
} from "../services/authorizations/campaignDiscussionAuthorizationService.js";

import {
  getCampaignDiscussionById,
  listCampaignDiscussions,
  createCampaignDiscussion,
} from "../services/campaignDiscussionService.js";

import { findCallAttemptById } from "../repositories/callAttemptRepository.js";
import { findCustomerById } from "../repositories/customerRepository.js";
import { findCampaignParticipationById } from "../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../repositories/campaignRepository.js";

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
    const discussion = await getCampaignDiscussionById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign discussion not found",
        },
      });
    }

    const callAttempt = await findCallAttemptById(discussion.callAttemptId);

    if (!callAttempt) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Call attempt not found",
        },
      });
    }

    const customer = await findCustomerById(callAttempt.customerId);

    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found",
        },
      });
    }

    const authorizationContext = await getCampaignDiscussionAuthorization(
      req.user,
    );

    authorizeCampaignDiscussionView(authorizationContext, customer.websiteId);

    return res.status(200).json({
      data: discussion,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCampaignDiscussion(req, res, next) {
  try {
    const callAttempt = await findCallAttemptById(req.body.callAttemptId);

    if (!callAttempt) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Call attempt not found",
        },
      });
    }

    const customer = await findCustomerById(callAttempt.customerId);

    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found",
        },
      });
    }

    const participation = await findCampaignParticipationById(
      req.body.campaignParticipationId,
    );

    if (!participation) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign participation not found",
        },
      });
    }

    const campaign = await findCampaignById(participation.campaignId);

    if (!campaign) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Campaign not found",
        },
      });
    }

    const authorizationContext = await getCampaignDiscussionAuthorization(
      req.user,
    );

    authorizeCampaignDiscussionCreate(authorizationContext, customer.websiteId);

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
