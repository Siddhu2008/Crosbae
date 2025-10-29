// src/api/api.js
import axios from "axios";
import { refreshToken } from "./auth";

const API_BASE = import.meta.env.DEV ? "/api" : "https://api.crosbae.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Normalize request paths so '/api' base + '/api/...' calls don't duplicate
api.interceptors.request.use((config) => {
  if (!import.meta.env.DEV || !config || !config.url) return config;

  // fix accidental '/api/api/' anywhere in the url
  config.url = config.url.replace(/\/api\/api\//g, "/api/");

  // if baseURL is '/api' and url starts with '/api/' remove leading '/api'
  const baseIsApi = String(config.baseURL || API_BASE) === "/api";
  if (baseIsApi && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }

  // also handle full absolute urls that may contain '/api/api/'
  try {
    const u = new URL(config.url, "http://localhost");
    const fixed = u.href.replace(/\/api\/api\//g, "/api/");
    if (fixed !== u.href) {
      // convert back to path relative to origin
      const p = new URL(fixed).pathname + new URL(fixed).search;
      config.url = p;
    }
  } catch (e) {
    // ignore invalid URL parsing
  }

  return config;
});

// attach access token for each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh queue to avoid concurrent refresh requests
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    if (!response) return Promise.reject(error);
    if (response.status !== 401) return Promise.reject(error);

    // prevent infinite loop for refresh endpoint or already retried requests
    if (originalRequest._retry) return Promise.reject(error);
    if (originalRequest.url && originalRequest.url.includes("/api/auth/token/refresh/")) {
      // refresh failed -> clear and redirect to login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) return reject(error);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;
    const refresh = localStorage.getItem("refresh");

    try {
      const res = await refreshToken(refresh);
      const newAccess = res?.data?.access;
      const newRefresh = res?.data?.refresh;
      if (newAccess) localStorage.setItem("access", newAccess);
      if (newRefresh) localStorage.setItem("refresh", newRefresh);
      if (newAccess) api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
      onRefreshed(newAccess);
      return api(originalRequest);
    } catch (err) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
