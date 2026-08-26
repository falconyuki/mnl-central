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

const PROMOTION_RECEIPT_STATUS = "RECEIVED";

export function validateCreatePromotionReceiptRequest(req, res, next) {
  const { promotionId, campaignParticipationId, remarks } = req.body ?? {};

  if (!isNonEmptyString(promotionId)) {
    return validationError(res, "Promotion ID is required.");
  }

  if (!isNonEmptyString(campaignParticipationId)) {
    return validationError(res, "Campaign participation ID is required.");
  }

  if (
    remarks !== undefined &&
    remarks !== null &&
    typeof remarks !== "string"
  ) {
    return validationError(res, "Remarks must be a string.");
  }

  req.body.promotionId = promotionId.trim();
  req.body.campaignParticipationId = campaignParticipationId.trim();

  if (typeof remarks === "string") {
    const normalizedRemarks = remarks.trim();

    req.body.remarks = normalizedRemarks.length > 0 ? normalizedRemarks : null;
  }

  next();
}

export function validatePromotionReceiptIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();

  next();
}

export function validateListPromotionReceiptsRequest(req, res, next) {
  const {
    page,
    pageSize,
    status,
    promotionId,
    campaignParticipationId,
    staffUserId,
  } = req.query ?? {};

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

  if (promotionId !== undefined && !isNonEmptyString(promotionId)) {
    return validationError(res, "Promotion ID must be a non-empty string.");
  }

  if (
    campaignParticipationId !== undefined &&
    !isNonEmptyString(campaignParticipationId)
  ) {
    return validationError(
      res,
      "Campaign participation ID must be a non-empty string.",
    );
  }

  if (staffUserId !== undefined && !isNonEmptyString(staffUserId)) {
    return validationError(res, "Staff user ID must be a non-empty string.");
  }

  if (typeof status === "string") {
    const normalizedStatus = status.trim();

    if (normalizedStatus !== PROMOTION_RECEIPT_STATUS) {
      return validationError(res, "Status must be 'RECEIVED'.");
    }

    req.query.status = normalizedStatus;
  }

  if (typeof promotionId === "string") {
    req.query.promotionId = promotionId.trim();
  }

  if (typeof campaignParticipationId === "string") {
    req.query.campaignParticipationId = campaignParticipationId.trim();
  }

  if (typeof staffUserId === "string") {
    req.query.staffUserId = staffUserId.trim();
  }

  next();
}
