import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";

export async function getCallAttemptAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeCallAttemptView(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "CALL_VIEW", websiteId);
}

export function authorizeCallAttemptCreate(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "CALL_CREATE", websiteId);
}

export function getAuthorizedCallAttemptWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }

  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessCallAttemptWebsite(authorizationContext, websiteId) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
