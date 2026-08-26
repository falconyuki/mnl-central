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

const CAMPAIGN_STATUS = new Set(["Draft", "Active", "Expired", "Cancelled"]);

export function validateCreateCampaignRequest(req, res, next) {
  const { websiteId, name, description, startDate, endDate, status } =
    req.body ?? {};

  if (!isNonEmptyString(websiteId)) {
    return validationError(res, "Website ID is required.");
  }

  if (!isNonEmptyString(name)) {
    return validationError(res, "Name is required.");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return validationError(res, "Description must be a string.");
  }

  if (!isNonEmptyString(startDate)) {
    return validationError(res, "Start date is required.");
  }

  if (!isNonEmptyString(endDate)) {
    return validationError(res, "End date is required.");
  }

  if (status !== undefined && !CAMPAIGN_STATUS.has(status)) {
    return validationError(
      res,
      "Status must be 'Draft', 'Active', 'Expired' or 'Cancelled'.",
    );
  }

  req.body.websiteId = websiteId.trim();
  req.body.name = name.trim();
  req.body.startDate = startDate.trim();
  req.body.endDate = endDate.trim();

  if (typeof description === "string") {
    const normalizedDescription = description.trim();
    req.body.description =
      normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  if (status !== undefined) {
    req.body.status = status;
  }
  next();
}

export function validateUpdateCampaignRequest(req, res, next) {
  const { name, description, startDate, endDate } = req.body ?? {};

  if (!isNonEmptyString(name)) {
    return validationError(res, "Name is required.");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return validationError(res, "Description must be a string.");
  }

  if (!isNonEmptyString(startDate)) {
    return validationError(res, "Start date is required.");
  }

  if (!isNonEmptyString(endDate)) {
    return validationError(res, "End date is required.");
  }

  req.body.name = name.trim();
  req.body.startDate = startDate.trim();
  req.body.endDate = endDate.trim();

  if (typeof description === "string") {
    const normalizedDescription = description.trim();
    req.body.description =
      normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  next();
}

export function validateCampaignStatusRequest(req, res, next) {
  const { status } = req.body ?? {};

  if (!CAMPAIGN_STATUS.has(status)) {
    return validationError(
      res,
      "Status must be 'Draft', 'Active', 'Expired' or 'Cancelled'.",
    );
  }

  req.body.status = status;
  next();
}

export function validateCampaignIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();
  next();
}

export function validateListCampaignsRequest(req, res, next) {
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
    if (!CAMPAIGN_STATUS.has(normalizedStatus)) {
      return validationError(
        res,
        "Status must be 'Draft', 'Active', 'Expired' or 'Cancelled'.",
      );
    }
    req.query.status = normalizedStatus;
  }
  next();
}
