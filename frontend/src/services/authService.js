import { apiRequest } from "./apiClient.js";

const ACCESS_TOKEN_KEY = "mnlCentral.accessToken";
const CURRENT_USER_KEY = "mnlCentral.currentUser";
let authorizationContext = null;

function getStoredValue(key) {
  return localStorage.getItem(key);
}

function setStoredValue(key, value) {
  localStorage.setItem(key, value);
}

function removeStoredValue(key) {
  localStorage.removeItem(key);
}

function setAuthorizationContext(authorization) {
  authorizationContext = authorization
    ? {
        isAdministrator: Boolean(authorization.isAdministrator),
        permissions: Array.isArray(authorization.permissions)
          ? [...authorization.permissions]
          : [],
        websites: Array.isArray(authorization.websites)
          ? [...authorization.websites]
          : [],
      }
    : null;
}

export function getAuthorizationContext() {
  return authorizationContext;
}

export function hasPermission(permission) {
  if (!permission || !authorizationContext) {
    return false;
  }

  if (authorizationContext.isAdministrator) {
    return true;
  }

  return authorizationContext.permissions.includes(permission);
}

export function hasWebsiteAccess(websiteId) {
  if (!websiteId || !authorizationContext) {
    return false;
  }

  if (authorizationContext.isAdministrator) {
    return true;
  }

  return authorizationContext.websites.some(
    (website) => website.id === websiteId,
  );
}

export function getAccessToken() {
  return getStoredValue(ACCESS_TOKEN_KEY);
}

export function getCurrentUser() {
  const storedUser = getStoredValue(CURRENT_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    removeStoredValue(CURRENT_USER_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export async function login(username, password) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      username,
      password,
    },
  });

  const accessToken = response?.data?.accessToken;
  const user = response?.data?.user;

  if (!accessToken || !user) {
    throw {
      status: 500,
      code: "INVALID_AUTH_RESPONSE",
      message: "The authentication response is invalid.",
      details: null,
    };
  }

  setStoredValue(ACCESS_TOKEN_KEY, accessToken);
  setStoredValue(CURRENT_USER_KEY, JSON.stringify(user));

  try {
    await getAuthenticatedUser();
  } catch (error) {
    clearSession();
    throw error;
  }

  return {
    accessToken,
    user,
  };
}

export async function getAuthenticatedUser() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await apiRequest("/auth/me", {
    method: "GET",
    token: accessToken,
  });

  const user = response?.data?.user;
  const authorization = response?.data?.authorization;

  if (!user || !authorization) {
    throw {
      status: 500,
      code: "INVALID_AUTH_RESPONSE",
      message: "The authenticated-user response is invalid.",
      details: null,
    };
  }

  setAuthorizationContext(authorization);
  setStoredValue(CURRENT_USER_KEY, JSON.stringify(user));

  return user;
}

export async function logout() {
  const accessToken = getAccessToken();

  try {
    if (accessToken) {
      await apiRequest("/auth/logout", {
        method: "POST",
        token: accessToken,
      });
    }
  } finally {
    clearSession();
  }
}

export async function changePassword(currentPassword, newPassword) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw {
      status: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
      details: null,
    };
  }

  await apiRequest("/auth/change-password", {
    method: "POST",
    token: accessToken,
    body: {
      currentPassword,
      newPassword,
    },
  });
}

export function clearSession() {
  removeStoredValue(ACCESS_TOKEN_KEY);
  removeStoredValue(CURRENT_USER_KEY);
  setAuthorizationContext(null);
}
