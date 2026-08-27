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

const CALL_STATUSES = new Set([
  "NO_ANSWER",
  "ANSWERED",
  "DROP_CALL",
  "INTERESTED",
  "NOT_INTERESTED",
  "CALL_BACK",
  "WRONG_NUMBER",
  "INVALID_NUMBER",
]);
const DISCUSSION_STATUSES = new Set(["DISCUSSED", "NOT_DISCUSSED"]);

export function validateCreateCallAttemptRequest(req, res, next) {
  const { customerId, callStatus, remarks } = req.body ?? {};

  if (!isNonEmptyString(customerId)) {
    return validationError(res, "Customer ID is required.");
  }

  if (!isNonEmptyString(callStatus)) {
    return validationError(res, "Call status is required.");
  }

  const normalizedCallStatus = callStatus.trim();

  if (!CALL_STATUSES.has(normalizedCallStatus)) {
    return validationError(res, "Invalid call status.");
  }

  if (
    remarks !== undefined &&
    remarks !== null &&
    typeof remarks !== "string"
  ) {
    return validationError(res, "Remarks must be a string.");
  }

  req.body.customerId = customerId.trim();
  req.body.callStatus = normalizedCallStatus;

  if (typeof remarks === "string") {
    const normalizedRemarks = remarks.trim();

    req.body.remarks = normalizedRemarks.length > 0 ? normalizedRemarks : null;
  }

  next();
}

export function validateCallAttemptIdParam(req, res, next) {
  const { id } = req.params ?? {};

  if (!isNonEmptyString(id)) {
    return validationError(res, "ID is required.");
  }

  req.params.id = id.trim();

  next();
}

export function validateListCallAttemptsRequest(req, res, next) {
  const { page, pageSize, callStatus, customerId, userId } = req.query ?? {};

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

  if (callStatus !== undefined && !isNonEmptyString(callStatus)) {
    return validationError(res, "Call status must be a non-empty string.");
  }

  if (customerId !== undefined && !isNonEmptyString(customerId)) {
    return validationError(res, "Customer ID must be a non-empty string.");
  }

  if (userId !== undefined && !isNonEmptyString(userId)) {
    return validationError(res, "User ID must be a non-empty string.");
  }

  if (typeof callStatus === "string") {
    const normalizedCallStatus = callStatus.trim();

    if (!CALL_STATUSES.has(normalizedCallStatus)) {
      return validationError(res, "Invalid call status.");
    }

    req.query.callStatus = normalizedCallStatus;
  }

  if (typeof customerId === "string") {
    req.query.customerId = customerId.trim();
  }

  if (typeof userId === "string") {
    req.query.userId = userId.trim();
  }

  next();
}

export function validateCreateCallAttemptWithDiscussionRequest(req, res, next) {
  const {
    customerId,
    callStatus,
    remarks,
    campaignParticipationId,
    discussionStatus,
    discussionRemarks,
  } = req.body ?? {};

  if (!isNonEmptyString(customerId)) {
    return validationError(res, "Customer ID is required.");
  }

  if (!isNonEmptyString(callStatus)) {
    return validationError(res, "Call status is required.");
  }

  const normalizedCallStatus = callStatus.trim();

  if (!CALL_STATUSES.has(normalizedCallStatus)) {
    return validationError(res, "Invalid call status.");
  }

  if (
    remarks !== undefined &&
    remarks !== null &&
    typeof remarks !== "string"
  ) {
    return validationError(res, "Remarks must be a string.");
  }

  if (!isNonEmptyString(campaignParticipationId)) {
    return validationError(res, "Campaign participation ID is required.");
  }

  if (!isNonEmptyString(discussionStatus)) {
    return validationError(res, "Discussion status is required.");
  }

  const normalizedDiscussionStatus = discussionStatus.trim();

  if (!DISCUSSION_STATUSES.has(normalizedDiscussionStatus)) {
    return validationError(res, "Invalid discussion status.");
  }

  if (
    discussionRemarks !== undefined &&
    discussionRemarks !== null &&
    typeof discussionRemarks !== "string"
  ) {
    return validationError(res, "Discussion remarks must be a string.");
  }

  req.body.customerId = customerId.trim();
  req.body.callStatus = normalizedCallStatus;
  req.body.campaignParticipationId = campaignParticipationId.trim();
  req.body.discussionStatus = normalizedDiscussionStatus;

  if (typeof remarks === "string") {
    const normalizedRemarks = remarks.trim();

    req.body.remarks = normalizedRemarks.length > 0 ? normalizedRemarks : null;
  }

  if (typeof discussionRemarks === "string") {
    const normalizedDiscussionRemarks = discussionRemarks.trim();

    req.body.discussionRemarks =
      normalizedDiscussionRemarks.length > 0
        ? normalizedDiscussionRemarks
        : null;
  }

  next();
}
