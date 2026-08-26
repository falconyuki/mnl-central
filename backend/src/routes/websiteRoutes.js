import { Router } from "express";
import {
  getWebsites,
  getWebsite,
  postWebsite,
  patchWebsite,
  postDisableWebsite,
} from "../controllers/websiteController.js";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateWebsiteRequest,
  validateWebsiteIdParam,
  validateListWebsitesRequest,
} from "../validation/websiteValidation.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("WEBSITE_VIEW"),
  validateListWebsitesRequest,
  getWebsites,
);
router.get(
  "/:id",
  requireAuthentication,
  requirePermission("WEBSITE_VIEW"),
  validateWebsiteIdParam,
  getWebsite,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("WEBSITE_CREATE"),
  validateWebsiteRequest,
  postWebsite,
);
router.patch(
  "/:id",
  requireAuthentication,
  requirePermission("WEBSITE_UPDATE"),
  validateWebsiteIdParam,
  validateWebsiteRequest,
  patchWebsite,
);
router.post(
  "/:id/disable",
  requireAuthentication,
  requirePermission("WEBSITE_DISABLE"),
  validateWebsiteIdParam,
  postDisableWebsite,
);

export default router;
