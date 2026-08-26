import { Router } from "express";
import authRoutes from "./authRoutes.js";
import websiteRoutes from "./websiteRoutes.js";
import customerRoutes from "./customerRoutes.js";
import campaignRoutes from "./campaignRoutes.js";

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

export default router;
