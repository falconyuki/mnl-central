function validationError(res, message) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateCustomerRequest(req, res, next) {
  const { websiteId, username, name, phone, status } = req.body ?? {};

  if (!isNonEmptyString(websiteId)) {
    return validationError(res, "Website ID is required.");
  }

  if (!isNonEmptyString(username)) {
    return validationError(res, "Username is required.");
  }

  if (!isNonEmptyString(name)) {
    return validationError(res, "Name is required.");
  }

  if (phone !== undefined && phone !== null && typeof phone !== "string") {
    return validationError(res, "Phone must be a string.");
  }

  if (status !== undefined && status !== "Active" && status !== "Inactive") {
    return validationError(res, "Status must be 'Active' or 'Inactive'.");
  }

  req.body.websiteId = websiteId.trim();
  req.body.username = username.trim();
  req.body.name = name.trim();

  if (typeof phone === "string") {
    const normalizedPhone = phone.trim();
    req.body.phone = normalizedPhone.length > 0 ? normalizedPhone : null;
  }

  if (status !== undefined) {
    req.body.status = status;
  }
  next();
}

export function validateUpdateCustomerRequest(req, res, next) {
  const { name, phone } = req.body ?? {};

  if (!isNonEmptyString(name)) {
    return validationError(res, "Name is required.");
  }

  if (phone !== undefined && phone !== null && typeof phone !== "string") {
    return validationError(res, "Phone must be a string.");
  }

  req.body.name = name.trim();

  if (typeof phone === "string") {
    const normalizedPhone = phone.trim();
    req.body.phone = normalizedPhone.length > 0 ? normalizedPhone : null;
  }

  next();
}

export function validateCustomerStatusRequest(req, res, next) {
  const { status } = req.body ?? {};

  if (status !== "Active" && status !== "Inactive") {
    return validationError(res, "Status must be 'Active' or 'Inactive'.");
  }

  req.body.status = status;
  next();
}

export function validateCustomerIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();
  next();
}

export function validateListCustomersRequest(req, res, next) {
  const { page, pageSize, search, status } = req.query ?? {};

  if (page !== undefined) {
    const parsedPage = Number(page);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return validationError(res, "Page must be a positive integer.");
    }
    req.query.page = parsedPage;
  }

  if (pageSize !== undefined) {
    const parsedPageSize = Number(pageSize);
    if (!Number.isInteger(parsedPageSize) || parsedPageSize < 1) {
      return validationError(res, "Page size must be a positive integer.");
    }
    req.query.pageSize = parsedPageSize;
  }

  if (search !== undefined && typeof search !== "string") {
    return validationError(res, "Search must be a string.");
  }

  if (status !== undefined && typeof status !== "string") {
    return validationError(res, "Status must be a string.");
  }

  if (typeof search === "string") {
    req.query.search = search.trim();
  }

  if (typeof status === "string") {
    req.query.status = status.trim();
  }
  next();
}
