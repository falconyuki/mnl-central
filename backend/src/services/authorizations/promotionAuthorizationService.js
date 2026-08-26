import {
  buildAuthorizationContext,
  authorize,
  hasWebsiteAccess,
} from "./authorizationService.js";

export async function getPromotionAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizePromotionView(authorizationContext, websiteId) {
  return authorize(authorizationContext, "PROMOTION_VIEW", websiteId);
}

export function authorizePromotionCreate(authorizationContext, websiteId) {
  return authorize(authorizationContext, "PROMOTION_CREATE", websiteId);
}

export function authorizePromotionUpdate(authorizationContext, websiteId) {
  return authorize(authorizationContext, "PROMOTION_UPDATE", websiteId);
}

export function authorizePromotionStatusUpdate(
  authorizationContext,
  websiteId,
) {
  return authorize(authorizationContext, "PROMOTION_STATUS_UPDATE", websiteId);
}

export function getAuthorizedPromotionWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }
  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessPromotionWebsite(authorizationContext, websiteId) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
