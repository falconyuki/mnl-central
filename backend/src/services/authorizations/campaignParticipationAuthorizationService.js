import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";

export async function getCampaignParticipationAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeCampaignParticipationView(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(
    authorizationContext,
    "PARTICIPATION_VIEW",
    websiteId,
  );
}

export function authorizeCampaignParticipationCreate(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(
    authorizationContext,
    "PARTICIPATION_CREATE",
    websiteId,
  );
}

export function authorizeCampaignParticipationStatusUpdate(
  authorizationContext,
  websiteId,
) {
  return authorizeOrThrow(
    authorizationContext,
    "PARTICIPATION_STATUS_UPDATE",
    websiteId,
  );
}

export function getAuthorizedCampaignParticipationWebsiteIds(
  authorizationContext,
) {
  if (authorizationContext.isAdministrator) {
    return null;
  }

  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessCampaignParticipationWebsite(
  authorizationContext,
  websiteId,
) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
