import { apiRequest } from "./apiClient.js";

export function listCallAttempts({
  token,
  page,
  pageSize,
  callStatus,
  customerId,
  userId,
} = {}) {
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.set("page", String(page));
  }

  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }

  if (callStatus !== undefined && callStatus !== "") {
    params.set("callStatus", callStatus);
  }

  if (customerId !== undefined && customerId !== "") {
    params.set("customerId", customerId);
  }

  if (userId !== undefined && userId !== "") {
    params.set("userId", userId);
  }

  const queryString = params.toString();

  return apiRequest(`/call-attempts${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function getCallAttempt({ token, id } = {}) {
  return apiRequest(`/call-attempts/${encodeURIComponent(id)}`, {
    method: "GET",
    token,
  });
}

export function createCallAttempt({
  token,
  customerId,
  callStatus,
  remarks,
} = {}) {
  return apiRequest("/call-attempts", {
    method: "POST",
    token,
    body: {
      customerId,
      callStatus,
      remarks,
    },
  });
}

export function createCallAttemptWithDiscussion({
  token,
  customerId,
  callStatus,
  remarks,
  campaignParticipationId,
  discussionStatus,
  discussionRemarks,
} = {}) {
  return apiRequest("/call-attempts/with-discussion", {
    method: "POST",
    token,
    body: {
      customerId,
      callStatus,
      remarks,
      campaignParticipationId,
      discussionStatus,
      discussionRemarks,
    },
  });
}
