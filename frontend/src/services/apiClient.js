import { ENV } from "../config/index.js";

const API_BASE_URL = ENV.API_BASE_URL.replace(/\/+$/, "");

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

function normalizeError(response, payload) {
  const error = payload?.error;

  return {
    status: response.status,
    code: error?.code || "HTTP_ERROR",
    message: error?.message || `Request failed with status ${response.status}.`,
    details: error?.details ?? null,
  };
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const headers = new Headers(customHeaders);

  if (body !== undefined && body !== null) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    method,
    headers,
    body:
      body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw normalizeError(response, payload);
  }

  return payload;
}
