import { Router } from "express";
import authRoutes from "./authRoutes.js";
import websiteRoutes from "./websiteRoutes.js";
import customerRoutes from "./customerRoutes.js";
import campaignRoutes from "./campaignRoutes.js";
import campaignParticipationRoutes from "./campaignParticipationRoutes.js";
import promotionRoutes from "./promotionRoutes.js";
import promotionReceiptRoutes from "./promotionReceiptRoutes.js";
import callAttemptRoutes from "./callAttemptRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "MNL Central API",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/websites", websiteRoutes);
router.use("/customers", customerRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/campaign-participations", campaignParticipationRoutes);
router.use("/promotions", promotionRoutes);
router.use("/promotion-receipts", promotionReceiptRoutes);
router.use("/call-attempts", callAttemptRoutes);

export default router;
