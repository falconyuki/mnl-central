const DISCUSSION_STATUSES = new Set(["DISCUSSED", "NOT_DISCUSSED"]);

function validationError(message, details = {}) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message,
      details,
    },
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePositiveInteger(value) {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    return null;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function validateCampaignDiscussionIdParam(req, res, next) {
  if (!isNonEmptyString(req.params.id)) {
    return res.status(400).json(
      validationError("Discussion ID is required.", {
        field: "id",
      }),
    );
  }

  req.params.id = req.params.id.trim();

  return next();
}

export function validateListCampaignDiscussionsRequest(req, res, next) {
  if (req.query.page !== undefined) {
    const page = parsePositiveInteger(req.query.page);

    if (page === null) {
      return res.status(400).json(
        validationError("Page must be a positive integer.", {
          field: "page",
        }),
      );
    }

    req.query.page = page;
  }

  if (req.query.pageSize !== undefined) {
    const pageSize = parsePositiveInteger(req.query.pageSize);

    if (pageSize === null) {
      return res.status(400).json(
        validationError("Page size must be a positive integer.", {
          field: "pageSize",
        }),
      );
    }

    req.query.pageSize = pageSize;
  }

  if (req.query.discussionStatus !== undefined) {
    if (
      typeof req.query.discussionStatus !== "string" ||
      !DISCUSSION_STATUSES.has(req.query.discussionStatus.trim())
    ) {
      return res.status(400).json(
        validationError("Invalid discussion status.", {
          field: "discussionStatus",
          allowedValues: [...DISCUSSION_STATUSES],
        }),
      );
    }

    req.query.discussionStatus = req.query.discussionStatus.trim();
  }

  if (req.query.callAttemptId !== undefined) {
    if (!isNonEmptyString(req.query.callAttemptId)) {
      return res.status(400).json(
        validationError("Call attempt ID must be a non-empty string.", {
          field: "callAttemptId",
        }),
      );
    }

    req.query.callAttemptId = req.query.callAttemptId.trim();
  }

  if (req.query.campaignParticipationId !== undefined) {
    if (!isNonEmptyString(req.query.campaignParticipationId)) {
      return res.status(400).json(
        validationError(
          "Campaign participation ID must be a non-empty string.",
          {
            field: "campaignParticipationId",
          },
        ),
      );
    }

    req.query.campaignParticipationId =
      req.query.campaignParticipationId.trim();
  }

  return next();
}

export function validateCreateCampaignDiscussionRequest(req, res, next) {
  const { callAttemptId, campaignParticipationId, discussionStatus, remarks } =
    req.body ?? {};

  if (!isNonEmptyString(callAttemptId)) {
    return res.status(400).json(
      validationError("Call attempt ID is required.", {
        field: "callAttemptId",
      }),
    );
  }

  if (!isNonEmptyString(campaignParticipationId)) {
    return res.status(400).json(
      validationError("Campaign participation ID is required.", {
        field: "campaignParticipationId",
      }),
    );
  }

  if (
    typeof discussionStatus !== "string" ||
    !DISCUSSION_STATUSES.has(discussionStatus.trim())
  ) {
    return res.status(400).json(
      validationError("Invalid discussion status.", {
        field: "discussionStatus",
        allowedValues: [...DISCUSSION_STATUSES],
      }),
    );
  }

  if (
    remarks !== undefined &&
    remarks !== null &&
    typeof remarks !== "string"
  ) {
    return res.status(400).json(
      validationError("Remarks must be a string or null.", {
        field: "remarks",
      }),
    );
  }

  req.body.callAttemptId = callAttemptId.trim();
  req.body.campaignParticipationId = campaignParticipationId.trim();
  req.body.discussionStatus = discussionStatus.trim();

  if (typeof remarks === "string") {
    const normalizedRemarks = remarks.trim();

    req.body.remarks = normalizedRemarks === "" ? null : normalizedRemarks;
  }

  return next();
}
