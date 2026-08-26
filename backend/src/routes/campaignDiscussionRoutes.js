import { Router } from "express";

import {
  getCampaignDiscussions,
  getCampaignDiscussion,
  postCampaignDiscussion,
} from "../controllers/campaignDiscussionController.js";

import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";

import {
  validateCampaignDiscussionIdParam,
  validateListCampaignDiscussionsRequest,
  validateCreateCampaignDiscussionRequest,
} from "../validation/campaignDiscussionValidation.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("DISCUSSION_VIEW"),
  validateListCampaignDiscussionsRequest,
  getCampaignDiscussions,
);

router.get(
  "/:id",
  requireAuthentication,
  requirePermission("DISCUSSION_VIEW"),
  validateCampaignDiscussionIdParam,
  getCampaignDiscussion,
);

router.post(
  "/",
  requireAuthentication,
  requirePermission("DISCUSSION_CREATE"),
  validateCreateCampaignDiscussionRequest,
  postCampaignDiscussion,
);

export default router;
