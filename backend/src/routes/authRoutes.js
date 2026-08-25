import { Router } from "express";
import {
  login,
  me,
  logout,
  changePasswordHandler,
} from "../controllers/authController.js";
import {
  validateLoginRequest,
  validateChangePasswordRequest,
} from "../validation/authValidation.js";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";

const router = Router();

router.post("/login", validateLoginRequest, login);
router.get("/me", requireAuthentication, me);
router.post("/logout", requireAuthentication, logout);
router.post(
  "/change-password",
  requireAuthentication,
  validateChangePasswordRequest,
  changePasswordHandler,
);

export default router;
