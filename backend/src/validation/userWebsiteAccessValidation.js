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

export function validateUserWebsiteAccessUserIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "User ID is required.");
  }

  req.params.id = id.trim();

  next();
}

export function validateGrantUserWebsiteAccessRequest(req, res, next) {
  const { websiteId } = req.body ?? {};

  if (!isNonEmptyString(websiteId)) {
    return validationError(res, "Website ID is required.");
  }

  req.body.websiteId = websiteId.trim();

  next();
}

export function validateRevokeUserWebsiteAccessRequest(req, res, next) {
  const { websiteId } = req.body ?? {};

  if (!isNonEmptyString(websiteId)) {
    return validationError(res, "Website ID is required.");
  }

  req.body.websiteId = websiteId.trim();

  next();
}
