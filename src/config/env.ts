const rawApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
export const env = {
  apiBaseUrl: rawApiBase ? rawApiBase.replace(/\/$/, "") : "/api",
  isProduction: import.meta.env.PROD,
};
