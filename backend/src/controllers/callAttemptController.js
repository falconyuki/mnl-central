import {
  getCallAttemptAuthorization,
  authorizeCallAttemptView,
  authorizeCallAttemptCreate,
  getAuthorizedCallAttemptWebsiteIds,
} from "../services/authorizations/callAttemptAuthorizationService.js";

import {
  getCallAttemptById,
  listCallAttempts,
  createCallAttempt,
} from "../services/callAttemptService.js";

import { getCustomerById } from "../services/customerService.js";

export async function getCallAttempts(req, res, next) {
  try {
    const authorizationContext = await getCallAttemptAuthorization(req.user);
    const websiteIds = getAuthorizedCallAttemptWebsiteIds(authorizationContext);

    const result = await listCallAttempts({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      callStatus: req.query.callStatus ?? null,
      customerId: req.query.customerId ?? null,
      userId: req.query.userId ?? null,
      websiteIds,
    });

    return res.status(200).json({
      data: result.rows,
      pagination: {
        page: Number(req.query.page ?? 1),
        pageSize: Number(req.query.pageSize ?? 20),
        total: result.total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCallAttempt(req, res, next) {
  try {
    const callAttempt = await getCallAttemptById(req.params.id);

    if (!callAttempt) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Call attempt not found",
        },
      });
    }

    const customer = await getCustomerById(callAttempt.customer_id);

    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found",
        },
      });
    }

    const authorizationContext = await getCallAttemptAuthorization(req.user);

    authorizeCallAttemptView(authorizationContext, customer.website_id);

    return res.status(200).json({
      data: callAttempt,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCallAttempt(req, res, next) {
  try {
    const customer = await getCustomerById(req.body.customerId);

    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found",
        },
      });
    }

    const authorizationContext = await getCallAttemptAuthorization(req.user);

    authorizeCallAttemptCreate(authorizationContext, customer.website_id);

    const callAttempt = await createCallAttempt({
      customerId: req.body.customerId,
      userId: req.user.id,
      callStatus: req.body.callStatus,
      remarks: req.body.remarks,
    });

    return res.status(201).json({
      data: callAttempt,
    });
  } catch (error) {
    return next(error);
  }
}
