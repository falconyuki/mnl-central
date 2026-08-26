import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreatePromotionRequest,
  validateUpdatePromotionRequest,
  validatePromotionStatusRequest,
  validatePromotionIdParam,
  validateListPromotionsRequest,
} from "../validation/promotionValidation.js";
import {
  getPromotions,
  getPromotion,
  postPromotion,
  patchPromotion,
  patchPromotionStatus,
} from "../controllers/promotionController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("PROMOTION_VIEW"),
  validateListPromotionsRequest,
  getPromotions,
);
router.get(
  "/:id",
  requireAuthentication,
  requirePermission("PROMOTION_VIEW"),
  validatePromotionIdParam,
  getPromotion,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("PROMOTION_CREATE"),
  validateCreatePromotionRequest,
  postPromotion,
);
router.patch(
  "/:id",
  requireAuthentication,
  requirePermission("PROMOTION_UPDATE"),
  validatePromotionIdParam,
  validateUpdatePromotionRequest,
  patchPromotion,
);
router.patch(
  "/:id/status",
  requireAuthentication,
  requirePermission("PROMOTION_STATUS_UPDATE"),
  validatePromotionIdParam,
  validatePromotionStatusRequest,
  patchPromotionStatus,
);

export default router;
