import { apiRequest } from "./apiClient.js";

export function listCampaigns({ token, page, pageSize, search, status } = {}) {
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.set("page", String(page));
  }

  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }

  if (search !== undefined && search !== "") {
    params.set("search", search);
  }

  if (status !== undefined && status !== "") {
    params.set("status", status);
  }

  const queryString = params.toString();

  return apiRequest(`/campaigns${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function getCampaign({ token, id } = {}) {
  return apiRequest(`/campaigns/${encodeURIComponent(id)}`, {
    method: "GET",
    token,
  });
}

export function createCampaign({
  token,
  websiteId,
  name,
  description,
  startDate,
  endDate,
  status,
  promotion,
} = {}) {
  return apiRequest("/campaigns", {
    method: "POST",
    token,
    body: {
      websiteId,
      name,
      description,
      startDate,
      endDate,
      status,
      promotion,
    },
  });
}

export function updateCampaign({
  token,
  id,
  name,
  description,
  startDate,
  endDate,
} = {}) {
  return apiRequest(`/campaigns/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: {
      name,
      description,
      startDate,
      endDate,
    },
  });
}

export function updateCampaignStatus({ token, id, status } = {}) {
  return apiRequest(`/campaigns/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: {
      status,
    },
  });
}
