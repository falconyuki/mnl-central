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

export function validateWebsiteRequest(req, res, next) {
  const { name, code, description } = req.body ?? {};
  if (!isNonEmptyString(name)) {
    return validationError(res, "Website name is required");
  }

  if (!isNonEmptyString(code)) {
    return validationError(res, "Website code is required");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return validationError(res, "Website description must be a string");
  }

  req.body.name = name.trim();
  req.body.code = code.trim();

  if (typeof description === "string") {
    const normalizedDescription = description.trim();
    req.body.description =
      normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  next();
}

export function validateWebsiteIdParam(req, res, next) {
  const { id } = req.params;
  if (!isNonEmptyString(id)) {
    return validationError(res, "Website ID is required");
  }
  req.params.id = id.trim();
  next();
}

export function validateListWebsitesRequest(req, res, next) {
  const { page, pageSize, search, status } = req.query;

  if (page !== undefined) {
    const parsedPage = Number(page);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return validationError(res, "Page must be a positive integer");
    }
    req.query.page = parsedPage;
  }

  if (pageSize !== undefined) {
    const parsedPageSize = Number(pageSize);
    if (!Number.isInteger(parsedPageSize) || parsedPageSize < 1) {
      return validationError(res, "Page size must be a positive integer");
    }
    req.query.pageSize = parsedPageSize;
  }

  if (search !== undefined && typeof search !== "string") {
    return validationError(res, "Search must be a string");
  }

  if (status !== undefined && typeof status !== "string") {
    return validationError(res, "Status must be a string");
  }

  if (typeof search === "string") {
    req.query.search = search.trim();
  }

  if (typeof status === "string") {
    req.query.status = status.trim();
  }

  next();
}
