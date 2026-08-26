import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticationMiddleware.js";
import { requirePermission } from "../middleware/authorizationMiddleware.js";
import {
  validateCreateCustomerRequest,
  validateUpdateCustomerRequest,
  validateCustomerStatusRequest,
  validateCustomerIdParam,
  validateListCustomersRequest,
} from "../validation/customerValidation.js";
import {
  getCustomers,
  getCustomer,
  postCustomer,
  patchCustomer,
  patchCustomerStatus,
} from "../controllers/customerController.js";

const router = Router();

router.get(
  "/",
  requireAuthentication,
  requirePermission("CUSTOMER_VIEW"),
  validateListCustomersRequest,
  getCustomers,
);
router.get(
  "/:id",
  requireAuthentication,
  requirePermission("CUSTOMER_VIEW"),
  validateCustomerIdParam,
  getCustomer,
);
router.post(
  "/",
  requireAuthentication,
  requirePermission("CUSTOMER_CREATE"),
  validateCreateCustomerRequest,
  postCustomer,
);
router.patch(
  "/:id",
  requireAuthentication,
  requirePermission("CUSTOMER_UPDATE"),
  validateCustomerIdParam,
  validateUpdateCustomerRequest,
  patchCustomer,
);
router.patch(
  "/:id/status",
  requireAuthentication,
  requirePermission("CUSTOMER_STATUS_UPDATE"),
  validateCustomerIdParam,
  validateCustomerStatusRequest,
  patchCustomerStatus,
);

export default router;
