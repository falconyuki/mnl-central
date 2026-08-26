import {
  getCustomerAuthorization,
  authorizeCustomerView,
  authorizeCustomerCreate,
  authorizeCustomerUpdate,
  authorizeCustomerStatusUpdate,
  getAuthorizedCustomerWebsiteIds,
} from "../services/customerAuthorizationService.js";
import {
  getCustomerById,
  listCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
} from "../services/customerService.js";

export async function getCustomers(req, res, next) {
  try {
    const authorizationContext = await getCustomerAuthorization(req.user);
    const websiteIds = getAuthorizedCustomerWebsiteIds(authorizationContext);

    const result = await listCustomers({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      search: req.query.search ?? null,
      status: req.query.status ?? null,
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

export async function getCustomer(req, res, next) {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found.",
        },
      });
    }

    const authorizationContext = await getCustomerAuthorization(req.user);
    authorizeCustomerView(authorizationContext, customer.websiteId);

    return res.status(200).json({
      data: customer,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postCustomer(req, res, next) {
  try {
    const authorizationContext = await getCustomerAuthorization(req.user);
    authorizeCustomerCreate(authorizationContext, req.body.websiteId);

    const customer = await createCustomer({
      websiteId: req.body.websiteId,
      username: req.body.username,
      name: req.body.name,
      phone: req.body.phone,
      status: req.body.status,
    });

    return res.status(201).json({
      data: customer,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchCustomer(req, res, next) {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found.",
        },
      });
    }

    const authorizationContext = await getCustomerAuthorization(req.user);
    authorizeCustomerUpdate(authorizationContext, customer.websiteId);

    const updatedCustomer = await updateCustomer(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
    });

    return res.status(200).json({
      data: updatedCustomer,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchCustomerStatus(req, res, next) {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Customer not found.",
        },
      });
    }

    const authorizationContext = await getCustomerAuthorization(req.user);
    authorizeCustomerStatusUpdate(authorizationContext, customer.websiteId);

    const updatedCustomer = await updateCustomerStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      data: updatedCustomer,
    });
  } catch (error) {
    return next(error);
  }
}
