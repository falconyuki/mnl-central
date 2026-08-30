import { apiRequest } from "./apiClient.js";

export function listPromotions({
  token,
  page,
  pageSize,
  search,
  status,
  campaignId,
} = {}) {
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

  if (campaignId !== undefined && campaignId !== "") {
    params.set("campaignId", campaignId);
  }

  const queryString = params.toString();

  return apiRequest(`/promotions${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function getPromotion({ token, id } = {}) {
  return apiRequest(`/promotions/${encodeURIComponent(id)}`, {
    method: "GET",
    token,
  });
}

export function createPromotion({
  token,
  campaignId,
  name,
  description,
  amount,
  status,
} = {}) {
  return apiRequest("/promotions", {
    method: "POST",
    token,
    body: {
      campaignId,
      name,
      description,
      amount,
      status,
    },
  });
}

export function updatePromotion({ token, id, name, description, amount } = {}) {
  return apiRequest(`/promotions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: {
      name,
      description,
      amount,
    },
  });
}

export function updatePromotionStatus({ token, id, status } = {}) {
  return apiRequest(`/promotions/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: {
      status,
    },
  });
}
