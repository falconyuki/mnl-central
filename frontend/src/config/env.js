const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const ENV = Object.freeze({
  API_BASE_URL: apiBaseUrl || "http://localhost:3000/api/v1",
});
