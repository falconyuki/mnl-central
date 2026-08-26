import { authorize, authorizeOrThrow } from "./authorizationService.js";

import { findCampaignDiscussionById } from "../../repositories/campaignDiscussionRepository.js";
import { findCallAttemptById } from "../../repositories/callAttemptRepository.js";
import { findCustomerById } from "../../repositories/customerRepository.js";
import { findCampaignParticipationById } from "../../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../../repositories/campaignRepository.js";

const DISCUSSION_VIEW_PERMISSION = "DISCUSSION_VIEW";
const DISCUSSION_CREATE_PERMISSION = "DISCUSSION_CREATE";

async function resolveDiscussionWebsiteId(discussion) {
  const callAttempt = await findCallAttemptById(discussion.call_attempt_id);

  if (!callAttempt) {
    return null;
  }

  const customer = await findCustomerById(callAttempt.customer_id);

  if (!customer) {
    return null;
  }

  const participation = await findCampaignParticipationById(
    discussion.campaign_participation_id,
  );

  if (!participation) {
    return null;
  }

  const campaign = await findCampaignById(participation.campaign_id);

  if (!campaign) {
    return null;
  }

  if (customer.website_id !== campaign.website_id) {
    return null;
  }

  return customer.website_id;
}

export async function getCampaignDiscussionAuthorization(user, discussionId) {
  const discussion = await findCampaignDiscussionById(discussionId);

  if (!discussion) {
    return {
      discussion: null,
      websiteId: null,
      allowed: false,
      reason: "NOT_FOUND",
    };
  }

  const websiteId = await resolveDiscussionWebsiteId(discussion);

  if (!websiteId) {
    return {
      discussion,
      websiteId: null,
      allowed: false,
      reason: "UNAUTHORIZED_WEBSITE",
    };
  }

  const authorization = authorize(user, DISCUSSION_VIEW_PERMISSION, websiteId);

  return {
    discussion,
    websiteId,
    ...authorization,
  };
}

export async function authorizeCampaignDiscussionView(authorizationContext) {
  return authorizeOrThrow(authorizationContext);
}

export async function authorizeCampaignDiscussionCreate(user, websiteId) {
  const authorization = authorize(
    user,
    DISCUSSION_CREATE_PERMISSION,
    websiteId,
  );

  return authorizeOrThrow(authorization);
}

export function getAuthorizedCampaignDiscussionWebsiteIds(user) {
  if (user?.isAdministrator === true) {
    return null;
  }

  return Array.isArray(user?.websiteIds) ? user.websiteIds : [];
}

export function canAccessCampaignDiscussionWebsite(user, websiteId) {
  const websiteIds = getAuthorizedCampaignDiscussionWebsiteIds(user);

  if (websiteIds === null) {
    return true;
  }

  return websiteIds.includes(websiteId);
}
