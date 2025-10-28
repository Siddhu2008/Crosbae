import axios from "axios";

const API_BASE = import.meta.env.DEV ? "/api" : "https://api.crosbae.com";

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allow cookies when backend uses HttpOnly refresh cookies
});

// Prevent double "/api/api/..." in dev when callers include "/api/..." already
instance.interceptors.request.use((config) => {
  if (!import.meta.env.DEV || !config || !config.url) return config;

  // quick replace any /api/api/ sequence
  config.url = config.url.replace(/\/api\/api\//g, "/api/");

  // if baseURL is '/api' and url starts with '/api/' remove leading '/api'
  if (String(config.baseURL || API_BASE) === "/api" && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }

  return config;
});

export const register = (userData) => instance.post("/auth/user/", userData);

export const login = async (userData) => {
  const res = await instance.post("/auth/login/", userData);
  // persist tokens only if returned in JSON (backend may set HttpOnly cookie instead)
  if (res?.data?.access) localStorage.setItem("access", res.data.access);
  if (res?.data?.refresh) localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const getCurrentUser = () => instance.get("/auth/me/");

export const refreshToken = (refresh) => {
  // If refresh value provided send it; else call refresh endpoint relying on cookie
  if (refresh) return instance.post("/auth/token/refresh/", { refresh });
  return instance.post("/api/auth/token/refresh/");
};

export const logout = async () => {
  try {
    // best-effort call to backend logout to clear server-side session/cookie
    await instance.post("/auth/logout/").catch(() => {});
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  }
};

export const googleLogin = (token) => instance.post("/auth/google/", { token });
export const getGoogleClientId = () => instance.get("/auth/google-client-id/");

export default API_BASE;
