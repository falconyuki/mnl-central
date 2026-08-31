import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreateCampaignParticipationRequest,
  validateCampaignParticipationStatusRequest,
  validateCampaignParticipationIdParam,
  validateListCampaignParticipationsRequest,
} from "../validation/campaignParticipationValidation.js";
import {
  getCampaignParticipations,
  getCampaignParticipation,
  postCampaignParticipation,
  patchCampaignParticipationStatus,
} from "../controllers/campaignParticipationController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  validateListCampaignParticipationsRequest,
  getCampaignParticipations,
);
router.get(
  "/:id",
  requireAuthentication,
  validateCampaignParticipationIdParam,
  getCampaignParticipation,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("PARTICIPATION_CREATE"),
  validateCreateCampaignParticipationRequest,
  postCampaignParticipation,
);
router.patch(
  "/:id/status",
  requireAuthentication,
  requirePermission("PARTICIPATION_STATUS_UPDATE"),
  validateCampaignParticipationIdParam,
  validateCampaignParticipationStatusRequest,
  patchCampaignParticipationStatus,
);

export default router;
