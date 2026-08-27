import {
  clearSession,
  getAuthenticatedUser,
  getAccessToken,
} from "./authService.js";

export const AUTH_STATES = Object.freeze({
  AUTHENTICATED: "authenticated",
  PASSWORD_CHANGE_REQUIRED: "password-change-required",
  UNAUTHENTICATED: "unauthenticated",
});

export async function resolveAuthentication() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return {
      state: AUTH_STATES.UNAUTHENTICATED,
      user: null,
    };
  }

  try {
    const user = await getAuthenticatedUser();

    if (user.mustChangePassword) {
      return {
        state: AUTH_STATES.PASSWORD_CHANGE_REQUIRED,
        user,
      };
    }

    return {
      state: AUTH_STATES.AUTHENTICATED,
      user,
    };
  } catch (error) {
    clearSession();

    return {
      state: AUTH_STATES.UNAUTHENTICATED,
      user: null,
      error,
    };
  }
}
