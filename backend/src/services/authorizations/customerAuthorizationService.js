import {
  buildAuthorizationContext,
  authorize,
  hasWebsiteAccess,
} from "./authorizationService.js";

export async function getCustomerAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeCustomerView(authorizationContext, websiteId) {
  return authorize(authorizationContext, "CUSTOMER_VIEW", websiteId);
}

export function authorizeCustomerCreate(authorizationContext, websiteId) {
  return authorize(authorizationContext, "CUSTOMER_CREATE", websiteId);
}

export function authorizeCustomerUpdate(authorizationContext, websiteId) {
  return authorize(authorizationContext, "CUSTOMER_UPDATE", websiteId);
}

export function authorizeCustomerStatusUpdate(authorizationContext, websiteId) {
  return authorize(authorizationContext, "CUSTOMER_STATUS_UPDATE", websiteId);
}

export function getAuthorizedCustomerWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }
  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessCustomerWebsite(authorizationContext, websiteId) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
