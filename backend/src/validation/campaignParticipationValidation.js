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

const PARTICIPATION_STATUS = new Set(["Active", "Expired"]);

export function validateCreateCampaignParticipationRequest(req, res, next) {
  const { campaignId, customerId, status } = req.body ?? {};

  if (!isNonEmptyString(campaignId)) {
    return validationError(res, "Campaign ID is required.");
  }

  if (!isNonEmptyString(customerId)) {
    return validationError(res, "Customer ID is required.");
  }

  req.body.campaignId = campaignId.trim();
  req.body.customerId = customerId.trim();

  next();
}

export function validateCampaignParticipationStatusRequest(req, res, next) {
  const { status } = req.body ?? {};

  if (!PARTICIPATION_STATUS.has(status)) {
    return validationError(res, "Status must be 'Active' or 'Expired'.");
  }

  req.body.status = status;
  next();
}

export function validateCampaignParticipationIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();
  next();
}

export function validateListCampaignParticipationsRequest(req, res, next) {
  const { page, pageSize, status, campaignId, customerId } = req.query ?? {};

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

  if (status !== undefined && typeof status !== "string") {
    return validationError(res, "Status must be a string.");
  }

  if (campaignId !== undefined && typeof campaignId !== "string") {
    return validationError(res, "Campaign ID must be a string.");
  }

  if (customerId !== undefined && typeof customerId !== "string") {
    return validationError(res, "Customer ID must be a string.");
  }

  if (typeof status === "string") {
    const normalizedStatus = status.trim();
    if (!PARTICIPATION_STATUS.has(normalizedStatus)) {
      return validationError(res, "Status must be 'Active' or 'Expired'.");
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

  if (typeof customerId === "string") {
    const normalizedCustomerId = customerId.trim();
    if (normalizedCustomerId.length === 0) {
      return validationError(res, "Customer ID is required.");
    }
    req.query.customerId = normalizedCustomerId;
  }
  next();
}
