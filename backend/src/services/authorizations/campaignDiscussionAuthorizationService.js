import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";

import { findCampaignDiscussionById } from "../../repositories/campaignDiscussionRepository.js";
import { findCallAttemptById } from "../../repositories/callAttemptRepository.js";
import { findCustomerById } from "../../repositories/customerRepository.js";
import { findCampaignParticipationById } from "../../repositories/campaignParticipationRepository.js";
import { findCampaignById } from "../../repositories/campaignRepository.js";

const DISCUSSION_VIEW_PERMISSION = "DISCUSSION_VIEW";
const DISCUSSION_CREATE_PERMISSION = "DISCUSSION_CREATE";

async function resolveDiscussionWebsiteId(discussion) {
  const callAttempt = await findCallAttemptById(discussion.callAttemptId);

  if (!callAttempt) {
    return null;
  }

  const customer = await findCustomerById(callAttempt.customerId);

  if (!customer) {
    return null;
  }

  const participation = await findCampaignParticipationById(
    discussion.campaignParticipationId,
  );

  if (!participation) {
    return null;
  }

  const campaign = await findCampaignById(participation.campaignId);

  if (!campaign) {
    return null;
  }

  if (customer.websiteId !== campaign.websiteId) {
    return null;
  }

  return customer.websiteId;
}

export async function getCampaignDiscussionAuthorization(user, discussionId) {
  const authorizationContext = await buildAuthorizationContext(user);

  const discussion = await findCampaignDiscussionById(discussionId);

  if (!discussion) {
    return {
      authorizationContext,
      discussion: null,
      websiteId: null,
      allowed: false,
      reason: "NOT_FOUND",
    };
  }

  const websiteId = await resolveDiscussionWebsiteId(discussion);

  if (!websiteId) {
    return {
      authorizationContext,
      discussion,
      websiteId: null,
      allowed: false,
      reason: "UNAUTHORIZED_WEBSITE",
    };
  }

  const authorization = {
    ...authorizeOrThrow(
      authorizationContext,
      DISCUSSION_VIEW_PERMISSION,
      websiteId,
    ),
  };

  return {
    authorizationContext,
    discussion,
    websiteId,
    ...authorization,
  };
}

export function authorizeCampaignDiscussionView(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(
    authorizationContext,
    DISCUSSION_VIEW_PERMISSION,
    websiteId,
  );
}

export function authorizeCampaignDiscussionCreate(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(
    authorizationContext,
    DISCUSSION_CREATE_PERMISSION,
    websiteId,
  );
}

export function getAuthorizedCampaignDiscussionWebsiteIds(
  authorizationContext,
) {
  if (authorizationContext.isAdministrator) {
    return null;
  }

  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessCampaignDiscussionWebsite(
  authorizationContext,
  websiteId,
) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
