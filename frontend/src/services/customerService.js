import { apiRequest } from "./apiClient.js";

export function listCustomers({ token, page, pageSize, search, status } = {}) {
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

  return apiRequest(`/customers${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function getCustomer({ token, id } = {}) {
  return apiRequest(`/customers/${encodeURIComponent(id)}`, {
    method: "GET",
    token,
  });
}

export function createCustomer({
  token,
  websiteId,
  username,
  name,
  phone,
  status,
} = {}) {
  return apiRequest("/customers", {
    method: "POST",
    token,
    body: {
      websiteId,
      username,
      name,
      phone,
      ...(status !== undefined ? { status } : {}),
    },
  });
}

export function updateCustomer({ token, id, name, phone } = {}) {
  return apiRequest(`/customers/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: {
      name,
      phone,
    },
  });
}

export function updateCustomerStatus({ token, id, status } = {}) {
  return apiRequest(`/customers/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: {
      status,
    },
  });
}
