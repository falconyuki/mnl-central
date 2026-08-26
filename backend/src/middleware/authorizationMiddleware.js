import {
  buildAuthorizationContext,
  authorize,
} from "../services/authorizations/authorizationService.js";

export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: "AUTHENTICATION_REQUIRED",
            message: "Authentication required",
          },
        });
      }

      const authorizationContext = await buildAuthorizationContext(req.user);
      const result = authorize(authorizationContext, permission);

      if (!result.allowed) {
        return res.status(403).json({
          error: {
            code: result.reason,
            message: "Insufficient permissions",
          },
        });
      }

      req.authorization = authorizationContext;
      next();
    } catch (error) {
      next(error);
    }
  };
}
