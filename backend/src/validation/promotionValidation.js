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

const PROMOTION_STATUS = new Set(["Active", "Inactive"]);

function validateAmount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function validateCreatePromotionRequest(req, res, next) {
  const { campaignId, name, description, amount, status } = req.body ?? {};

  if (!isNonEmptyString(campaignId)) {
    return validationError(res, "Campaign ID is required.");
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

  if (amount !== undefined && amount !== null && !validateAmount(amount)) {
    return validationError(res, "Amount must be a positive number.");
  }

  if (status !== undefined && !PROMOTION_STATUS.has(status)) {
    return validationError(res, "Status must be 'Active' or 'Inactive'.");
  }

  req.body.campaignId = campaignId.trim();
  req.body.name = name.trim();

  if (typeof description === "string") {
    const normalizedDescription = description.trim();
    req.body.description =
      normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  if (amount !== undefined) {
    req.body.amount = amount;
  }

  if (status !== undefined) {
    req.body.status = status;
  }
  next();
}

export function validateUpdatePromotionRequest(req, res, next) {
  const { name, description, amount } = req.body ?? {};

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

  if (amount !== undefined && amount !== null && !validateAmount(amount)) {
    return validationError(res, "Amount must be a positive number.");
  }

  req.body.name = name.trim();

  if (typeof description === "string") {
    const normalizedDescription = description.trim();
    req.body.description =
      normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  if (amount !== undefined) {
    req.body.amount = amount;
  }

  next();
}

export function validatePromotionStatusRequest(req, res, next) {
  const { status } = req.body ?? {};

  if (!PROMOTION_STATUS.has(status)) {
    return validationError(res, "Status must be 'Active' or 'Inactive'.");
  }

  req.body.status = status;
  next();
}

export function validatePromotionIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();
  next();
}

export function validateListPromotionsRequest(req, res, next) {
  const { page, pageSize, search, status, campaignId } = req.query ?? {};

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

  if (campaignId !== undefined && typeof campaignId !== "string") {
    return validationError(res, "Campaign ID must be a string.");
  }

  if (typeof search === "string") {
    req.query.search = search.trim();
  }

  if (typeof status === "string") {
    const normalizedStatus = status.trim();
    if (!PROMOTION_STATUS.has(normalizedStatus)) {
      return validationError(res, "Status must be 'Active' or 'Inactive'.");
    }
    req.query.status = normalizedStatus;
  }

  if (typeof campaignId === "string") {
    const normalizedCampaignId = campaignId.trim();
    if (normalizedCampaignId.length === 0) {
      return validationError(res, "Campaign ID is required.");
    }
    req.query.campaignId = normalizedCampaignId;
  }
  next();
}
