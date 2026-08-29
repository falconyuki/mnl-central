import { apiRequest } from "./apiClient.js";

export function listUsers({ token, page, pageSize, search, status } = {}) {
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

  return apiRequest(`/users${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
}

export function createUser({ token, username, displayName, password, roleId }) {
  return apiRequest("/users", {
    method: "POST",
    token,
    body: {
      username,
      displayName,
      password,
      roleId,
    },
  });
}
