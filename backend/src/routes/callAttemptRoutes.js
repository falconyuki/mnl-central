import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreateCallAttemptRequest,
  validateCallAttemptIdParam,
  validateListCallAttemptsRequest,
} from "../validation/callAttemptValidation.js";
import {
  getCallAttempts,
  getCallAttempt,
  postCallAttempt,
} from "../controllers/callAttemptController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("CALL_VIEW"),
  validateListCallAttemptsRequest,
  getCallAttempts,
);
router.get(
  "/:id",
  requireAuthentication,
  requirePermission("CALL_VIEW"),
  validateCallAttemptIdParam,
  getCallAttempt,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("CALL_CREATE"),
  validateCreateCallAttemptRequest,
  postCallAttempt,
);

export default router;
