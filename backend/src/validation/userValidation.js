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

const USER_STATUS = new Set(["Active", "Disabled"]);

export function validateCreateUserRequest(req, res, next) {
  const { username, displayName, password, roleId } = req.body ?? {};

  if (!isNonEmptyString(username)) {
    return validationError(res, "Username is required.");
  }

  if (!isNonEmptyString(displayName)) {
    return validationError(res, "Display name is required.");
  }

  if (!isNonEmptyString(password)) {
    return validationError(res, "Password is required.");
  }

  if (!isNonEmptyString(roleId)) {
    return validationError(res, "Role ID is required.");
  }

  req.body.username = username.trim();
  req.body.displayName = displayName.trim();
  req.body.roleId = roleId.trim();

  next();
}

export function validateUpdateUserRequest(req, res, next) {
  const { displayName } = req.body ?? {};

  if (!isNonEmptyString(displayName)) {
    return validationError(res, "Display name is required.");
  }

  req.body.displayName = displayName.trim();

  next();
}

export function validateUpdateUserStatusRequest(req, res, next) {
  const { status } = req.body ?? {};

  if (!USER_STATUS.has(status)) {
    return validationError(res, "Status must be 'Active' or 'Disabled'.");
  }

  req.body.status = status;

  next();
}

export function validateUpdateUserRoleRequest(req, res, next) {
  const { roleId } = req.body ?? {};

  if (!isNonEmptyString(roleId)) {
    return validationError(res, "Role ID is required.");
  }

  req.body.roleId = roleId.trim();

  next();
}

export function validateResetUserPasswordRequest(req, res, next) {
  const { password } = req.body ?? {};

  if (!isNonEmptyString(password)) {
    return validationError(res, "Password is required.");
  }

  next();
}

export function validateUserIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();

  next();
}

export function validateListUsersRequest(req, res, next) {
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
    const normalizedStatus = status.trim();

    if (!USER_STATUS.has(normalizedStatus)) {
      return validationError(res, "Status must be 'Active' or 'Disabled'.");
    }

    req.query.status = normalizedStatus;
  }

  next();
}
