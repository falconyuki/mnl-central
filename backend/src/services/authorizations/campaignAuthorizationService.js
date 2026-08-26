import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";
export async function getCampaignAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeCampaignView(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "CAMPAIGN_VIEW", websiteId);
}

export function authorizeCampaignCreate(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "CAMPAIGN_CREATE", websiteId);
}

export function authorizeCampaignUpdate(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "CAMPAIGN_UPDATE", websiteId);
}

export function authorizeCampaignStatusUpdate(authorizationContext, websiteId) {
  return authorizeOrThrow(
    authorizationContext,
    "CAMPAIGN_STATUS_UPDATE",
    websiteId,
  );
}

export function getAuthorizedCampaignWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }
  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessCampaignWebsite(authorizationContext, websiteId) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
