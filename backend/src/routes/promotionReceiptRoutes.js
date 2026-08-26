import { Router } from "express";

import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";

import {
  validatePromotionReceiptIdParam,
  validateCreatePromotionReceiptRequest,
  validateListPromotionReceiptsRequest,
} from "../validation/promotionReceiptValidation.js";

import {
  getPromotionReceipts,
  getPromotionReceipt,
  postPromotionReceipt,
} from "../controllers/promotionReceiptController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("PROMOTION_RECEIPT_VIEW"),
  validateListPromotionReceiptsRequest,
  getPromotionReceipts,
);

router.get(
  "/:id",
  requireAuthentication,
  requirePermission("PROMOTION_RECEIPT_VIEW"),
  validatePromotionReceiptIdParam,
  getPromotionReceipt,
);

router.post(
  "/",
  requireAuthentication,
  requirePermission("PROMOTION_RECEIPT_CREATE"),
  validateCreatePromotionReceiptRequest,
  postPromotionReceipt,
);

export default router;
