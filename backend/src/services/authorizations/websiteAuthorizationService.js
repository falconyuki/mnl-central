import {
  buildAuthorizationContext,
  hasWebsiteAccess,
  authorizeOrThrow,
} from "./authorizationService.js";

export async function getWebsiteAuthorization(user) {
  return buildAuthorizationContext(user);
}

export function authorizeWebsiteView(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "WEBSITE_VIEW", websiteId);
}

export function authorizeWebsiteCreate(authorizationContext) {
  return authorizeOrThrow(authorizationContext, "WEBSITE_CREATE");
}

export function authorizeWebsiteUpdate(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "WEBSITE_UPDATE", websiteId);
}

export function authorizeWebsiteDisable(authorizationContext, websiteId) {
  return authorizeOrThrow(authorizationContext, "WEBSITE_DISABLE", websiteId);
}

export function getAuthorizedWebsiteIds(authorizationContext) {
  if (authorizationContext.isAdministrator) {
    return null;
  }
  return authorizationContext.websites
    .filter((website) => website.status === "Active")
    .map((website) => website.id);
}

export function canAccessWebsite(authorizationContext, websiteId) {
  return hasWebsiteAccess(authorizationContext, websiteId);
}
