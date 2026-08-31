import {
  buildAuthorizationContext,
  hasPermission,
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
  const permission =
    getCampaignParticipationReadPermission(authorizationContext);

  if (!permission) {
    return authorizeOrThrow(
      authorizationContext,
      "PARTICIPATION_VIEW",
      websiteId,
    );
  }

  return authorizeOrThrow(authorizationContext, permission, websiteId);
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

function getCampaignParticipationReadPermission(authorizationContext) {
  if (hasPermission(authorizationContext, "PARTICIPATION_VIEW")) {
    return "PARTICIPATION_VIEW";
  }

  if (hasPermission(authorizationContext, "CALL_VIEW")) {
    return "CALL_VIEW";
  }

  return null;
}

export function authorizeCampaignParticipationList(authorizationContext) {
  const permission =
    getCampaignParticipationReadPermission(authorizationContext);

  if (!permission) {
    return authorizeOrThrow(authorizationContext, "PARTICIPATION_VIEW");
  }

  return authorizeOrThrow(authorizationContext, permission);
}
