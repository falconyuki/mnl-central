import {
  authenticate,
  changePassword,
} from "../services/authenticationService.js";
import { revokeToken } from "../security/tokenRevocationService.js";
import { buildAuthorizationContext } from "../services/authorizations/authorizationService.js";

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authenticate(username, password);
    if (!result.success) {
      if (result.reason === "ACCOUNT_DISABLED") {
        return res.status(403).json({
          error: {
            code: "ACCOUNT_DISABLED",
            message: "Account is disabled",
          },
        });
      }
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid username or password",
        },
      });
    }

    return res.status(200).json({
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const authorizationContext = await buildAuthorizationContext(req.user);
    return res.status(200).json({
      data: {
        user: req.user,
        authorization: {
          isAdministrator: authorizationContext.isAdministrator,
          permissions: [...authorizationContext.permissions],
          websites: authorizationContext.websites,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    revokeToken(req.auth.token);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function changePasswordHandler(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changePassword(
      req.auth.userId,
      currentPassword,
      newPassword,
    );
    if (!result.success) {
      if (result.reason === "INVALID_CURRENT_PASSWORD") {
        return res.status(401).json({
          error: {
            code: "INVALID_CURRENT_PASSWORD",
            message: "The current password is incorrect.",
          },
        });
      }
      if (result.reason === "PASSWORD_UNCHANGED") {
        return res.status(400).json({
          error: {
            code: "PASSWORD_UNCHANGED",
            message:
              "The new password must be different from the current password.",
          },
        });
      }
      if (result.reason === "ACCOUNT_DISABLED") {
        return res.status(403).json({
          error: {
            code: "ACCOUNT_DISABLED",
            message: "Account is disabled",
          },
        });
      }
      return res.status(404).json({
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
