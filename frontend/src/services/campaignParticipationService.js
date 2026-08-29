import { apiRequest } from "./apiClient.js";

export function listCampaignParticipations({
  token,
  page,
  pageSize,
  status,
  campaignId,
  customerId,
} = {}) {
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.set("page", String(page));
  }

  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }

  if (status !== undefined && status !== "") {
    params.set("status", status);
  }

  if (campaignId !== undefined && campaignId !== "") {
    params.set("campaignId", campaignId);
  }

  if (customerId !== undefined && customerId !== "") {
    params.set("customerId", customerId);
  }

  const queryString = params.toString();

  return apiRequest(
    `/campaign-participations${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      token,
    },
  );
}

export function getCampaignParticipation({ token, id } = {}) {
  return apiRequest(`/campaign-participations/${encodeURIComponent(id)}`, {
    method: "GET",
    token,
  });
}

export function createCampaignParticipation({
  token,
  campaignId,
  customerId,
} = {}) {
  return apiRequest("/campaign-participations", {
    method: "POST",
    token,
    body: {
      campaignId,
      customerId,
    },
  });
}

export function updateCampaignParticipationStatus({ token, id, status } = {}) {
  return apiRequest(
    `/campaign-participations/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      token,
      body: {
        status,
      },
    },
  );
}
