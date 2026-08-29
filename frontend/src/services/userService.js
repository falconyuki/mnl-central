import { apiRequest } from "./apiClient.js";

export function listUsers({
  token,
  page,
  pageSize,
  search,
  status,
  roleId,
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

  if (roleId !== undefined && roleId !== "") {
    params.set("roleId", roleId);
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

export function updateUser({ token, id, displayName }) {
  return apiRequest(`/users/${id}`, {
    method: "PATCH",
    token,
    body: {
      displayName,
    },
  });
}

export function updateUserStatus({ token, id, status }) {
  return apiRequest(`/users/${id}/status`, {
    method: "PATCH",
    token,
    body: {
      status,
    },
  });
}

export function updateUserRole({ token, id, roleId }) {
  return apiRequest(`/users/${id}/role`, {
    method: "PATCH",
    token,
    body: {
      roleId,
    },
  });
}

export function resetUserPassword({ token, id, password }) {
  return apiRequest(`/users/${id}/reset-password`, {
    method: "POST",
    token,
    body: {
      password,
    },
  });
}

export function listUserWebsiteAccess({ token, id }) {
  return apiRequest(`/users/${id}/websites`, {
    method: "GET",
    token,
  });
}

export function grantUserWebsiteAccess({ token, id, websiteId }) {
  return apiRequest(`/users/${id}/websites`, {
    method: "POST",
    token,
    body: {
      websiteId,
    },
  });
}

export function revokeUserWebsiteAccess({ token, id, websiteId }) {
  return apiRequest(`/users/${id}/websites`, {
    method: "DELETE",
    token,
    body: {
      websiteId,
    },
  });
}
