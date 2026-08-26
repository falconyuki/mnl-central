import { Router } from "express";
import authRoutes from "./authRoutes.js";
import websiteRoutes from "./websiteRoutes.js";

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

export default router;
