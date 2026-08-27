import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreateCallAttemptRequest,
  validateCallAttemptIdParam,
  validateListCallAttemptsRequest,
  validateCreateCallAttemptWithDiscussionRequest,
} from "../validation/callAttemptValidation.js";
import {
  getCallAttempts,
  getCallAttempt,
  postCallAttempt,
  postCallAttemptWithDiscussion,
} from "../controllers/callAttemptController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("CALL_VIEW"),
  validateListCallAttemptsRequest,
  getCallAttempts,
);
router.post(
  "/with-discussion",
  requireAuthentication,
  requirePermission("CALL_CREATE"),
  requirePermission("DISCUSSION_CREATE"),
  validateCreateCallAttemptWithDiscussionRequest,
  postCallAttemptWithDiscussion,
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
