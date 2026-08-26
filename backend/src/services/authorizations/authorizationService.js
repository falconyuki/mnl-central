import { execute } from "../../database/database.js";
import { AppError } from "../../errors/AppError.js";

export async function getUserPermissions(userId) {
  const result = await execute(
    `SELECT DISTINCT p.code FROM role_permissions rp
        INNER JOIN permissions p ON p.id = rp.permission_id
        INNER JOIN users u ON u.role_id = rp.role_id
        WHERE u.id = ? ORDER BY p.code ASC`,
    [userId],
  );

  return result.rows.map((row) => row.code);
}

export async function getUserWebsiteAccess(userId) {
  const result = await execute(
    `SELECT w.id, w.name, w.code, w.status
        FROM user_website_access uwa
        INNER JOIN websites w ON w.id = uwa.website_id
        WHERE uwa.user_id = ?
        ORDER BY w.name ASC`,
    [userId],
  );

  return result.rows;
}

export async function buildAuthorizationContext(user) {
  const permissions = await getUserPermissions(user.id);
  const isAdministrator = user.roleName === "Administrator";
  const websites = isAdministrator ? [] : await getUserWebsiteAccess(user.id);

  return {
    userId: user.id,
    roleId: user.roleId,
    roleName: user.roleName,
    isAdministrator,
    permissions: new Set(permissions),
    websites,
  };
}

export function hasPermission(authorizationContext, permission) {
  if (authorizationContext.isAdministrator) {
    return true;
  }
  return authorizationContext.permissions.has(permission);
}

export function hasWebsiteAccess(authorizationContext, websiteId) {
  if (authorizationContext.isAdministrator) {
    return true;
  }

  if (!websiteId) {
    return false;
  }

  return authorizationContext.websites.some(
    (website) => website.id === websiteId && website.status === "Active",
  );
}

export function authorize(authorizationContext, permission, websiteId = null) {
  if (!hasPermission(authorizationContext, permission)) {
    return {
      allowed: false,
      reason: "INSUFFICIENT_PERMISSIONS",
    };
  }

  if (
    websiteId !== null &&
    !hasWebsiteAccess(authorizationContext, websiteId)
  ) {
    return {
      allowed: false,
      reason: "UNAUTHORIZED_WEBSITE",
    };
  }

  return {
    allowed: true,
  };
}

export function authorizeOrThrow(
  authorizationContext,
  permission,
  websiteId = null,
) {
  const result = authorize(authorizationContext, permission, websiteId);

  if (!result.allowed) {
    throw new AppError(
      result.reason === "UNAUTHORIZED_WEBSITE"
        ? "Unauthorized website."
        : "Insufficient permissions.",
      {
        code: result.reason,
        statusCode: 403,
      },
    );
  }

  return result;
}
