import { Router } from "express";

import { listRolesController } from "../controllers/roleController.js";

import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";

const router = Router();

router.use(requireAuthentication);

router.get("/", requirePermission("ROLE_VIEW"), listRolesController);

export default router;
