import { Router } from "express";

import {
  createUserController,
  getUserController,
  listUsersController,
  resetUserPasswordController,
  updateUserController,
  updateUserRoleController,
  updateUserStatusController,
} from "../controllers/userController.js";

import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";

import {
  validateCreateUserRequest,
  validateListUsersRequest,
  validateResetUserPasswordRequest,
  validateUpdateUserRequest,
  validateUpdateUserRoleRequest,
  validateUpdateUserStatusRequest,
  validateUserIdParam,
} from "../validation/userValidation.js";

import {
  listUserWebsiteAccessController,
  grantUserWebsiteAccessController,
  revokeUserWebsiteAccessController,
} from "../controllers/userWebsiteAccessController.js";

import {
  validateUserWebsiteAccessUserIdParam,
  validateGrantUserWebsiteAccessRequest,
  validateRevokeUserWebsiteAccessRequest,
} from "../validation/userWebsiteAccessValidation.js";

const router = Router();

router.use(requireAuthentication);

router.get(
  "/",
  requirePermission("USER_VIEW"),
  validateListUsersRequest,
  listUsersController,
);

router.get(
  "/:id",
  requirePermission("USER_VIEW"),
  validateUserIdParam,
  getUserController,
);

router.post(
  "/",
  requirePermission("USER_CREATE"),
  validateCreateUserRequest,
  createUserController,
);

router.patch(
  "/:id",
  requirePermission("USER_UPDATE"),
  validateUserIdParam,
  validateUpdateUserRequest,
  updateUserController,
);

router.patch(
  "/:id/status",
  requirePermission("USER_DISABLE"),
  validateUserIdParam,
  validateUpdateUserStatusRequest,
  updateUserStatusController,
);

router.patch(
  "/:id/role",
  requirePermission("USER_MANAGE_ROLE"),
  validateUserIdParam,
  validateUpdateUserRoleRequest,
  updateUserRoleController,
);

router.post(
  "/:id/reset-password",
  requirePermission("USER_RESET_PASSWORD"),
  validateUserIdParam,
  validateResetUserPasswordRequest,
  resetUserPasswordController,
);

router.get(
  "/:id/websites",
  requirePermission("USER_MANAGE_WEBSITE_ACCESS"),
  validateUserWebsiteAccessUserIdParam,
  listUserWebsiteAccessController,
);

router.post(
  "/:id/websites",
  requirePermission("USER_MANAGE_WEBSITE_ACCESS"),
  validateUserWebsiteAccessUserIdParam,
  validateGrantUserWebsiteAccessRequest,
  grantUserWebsiteAccessController,
);

router.delete(
  "/:id/websites",
  requirePermission("USER_MANAGE_WEBSITE_ACCESS"),
  validateUserWebsiteAccessUserIdParam,
  validateRevokeUserWebsiteAccessRequest,
  revokeUserWebsiteAccessController,
);

export default router;
