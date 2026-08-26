import {
  buildAuthorizationContext,
  authorize,
  hasWebsiteAccess,
} from "./authorizationService.js";

export async function getPromotionReceiptAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizePromotionReceiptView(authorizationContext, websiteId) {
  return authorize(authorizationContext, "PROMOTION_RECEIPT_VIEW", websiteId);
}

export function authorizePromotionReceiptCreate(
  authorizationContext,
  websiteId,
) {
  return authorize(authorizationContext, "PROMOTION_RECEIPT_CREATE", websiteId);
}

export function getAuthorizedPromotionReceiptWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }

  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessPromotionReceiptWebsite(
  authorizationContext,
  websiteId,
) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
