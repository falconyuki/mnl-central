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

export default router;
