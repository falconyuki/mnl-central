import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreateCampaignRequest,
  validateUpdateCampaignRequest,
  validateCampaignStatusRequest,
  validateCampaignIdParam,
  validateListCampaignsRequest,
} from "../validation/campaignValidation.js";
import {
  getCampaigns,
  getCampaign,
  postCampaign,
  patchCampaign,
  patchCampaignStatus,
} from "../controllers/campaignController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("CAMPAIGN_VIEW"),
  validateListCampaignsRequest,
  getCampaigns,
);
router.get(
  "/:id",
  requireAuthentication,
  requirePermission("CAMPAIGN_VIEW"),
  validateCampaignIdParam,
  getCampaign,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("CAMPAIGN_CREATE"),
  validateCreateCampaignRequest,
  postCampaign,
);
router.patch(
  "/:id",
  requireAuthentication,
  requirePermission("CAMPAIGN_UPDATE"),
  validateCampaignIdParam,
  validateUpdateCampaignRequest,
  patchCampaign,
);
router.patch(
  "/:id/status",
  requireAuthentication,
  requirePermission("CAMPAIGN_STATUS_UPDATE"),
  validateCampaignIdParam,
  validateCampaignStatusRequest,
  patchCampaignStatus,
);

export default router;
