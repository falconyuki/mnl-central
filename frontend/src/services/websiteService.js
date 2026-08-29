import { apiRequest } from "./apiClient.js";

export function listWebsites({ token, page, pageSize, search, status } = {}) {
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

  return apiRequest(`/websites${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function createWebsite({ token, name, code, description, status } = {}) {
  return apiRequest("/websites", {
    method: "POST",
    token,
    body: {
      name,
      code,
      description,
      ...(status !== undefined ? { status } : {}),
    },
  });
}

export function updateWebsite({ token, id, name, code, description } = {}) {
  return apiRequest(`/websites/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: {
      name,
      code,
      description,
    },
  });
}

export function disableWebsite({ token, id } = {}) {
  return apiRequest(`/websites/${encodeURIComponent(id)}/disable`, {
    method: "POST",
    token,
  });
}
