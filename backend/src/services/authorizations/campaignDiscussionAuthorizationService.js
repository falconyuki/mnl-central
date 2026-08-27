import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";

export async function getCampaignDiscussionAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeCampaignDiscussionView(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(authorizationContext, "DISCUSSION_VIEW", websiteId);
}

export function authorizeCampaignDiscussionCreate(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(authorizationContext, "DISCUSSION_CREATE", websiteId);
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
