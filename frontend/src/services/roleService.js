import { apiRequest } from "./apiClient.js";

export function listRoles({ token } = {}) {
  return apiRequest("/roles", {
    method: "GET",
    token,
  });
}
