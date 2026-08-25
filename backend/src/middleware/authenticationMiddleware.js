import { verifyAccessToken } from "../security/jwtService.js";
import { isTokenRevoked } from "../security/tokenRevocationService.js";
import { getAuthenticatedUser } from "../services/authenticationService.js";

export async function requireAuthentication(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required",
        },
      });
    }

    const token = authorizationHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required",
        },
      });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        error: {
          code: "INVALID_OR_EXPIRED_TOKEN",
          message: "Invalid or expired token",
        },
      });
    }

    if (isTokenRevoked(token)) {
      return res.status(401).json({
        error: {
          code: "TOKEN_REVOKED",
          message: "Token revoked",
        },
      });
    }

    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({
        error: {
          code: "INVALID_TOKEN_PAYLOAD",
          message: "Invalid token payload",
        },
      });
    }

    const user = await getAuthenticatedUser(userId);
    if (!user) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "The authenticated user is no longer available",
        },
      });
    }

    req.auth = {
      userId: user.id,
      username: user.username,
      roleId: user.roleId,
      roleName: user.roleName,
      token,
    };

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
