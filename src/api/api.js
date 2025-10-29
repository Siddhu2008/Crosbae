// src/api/api.js
import axios from "axios";
import { refreshToken as refreshTokenAPI } from "./auth";

// Use Vite env variable when provided. In dev, fall back to a local proxy path '/api'
// so the Vite dev-server proxy can forward requests to the real backend and
// avoid CORS. In production, default to the real API URL.
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '/api' : 'https://api.crosbae.com');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // If refresh token is HttpOnly cookie
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        const res = await refreshTokenAPI(refresh);
        const { access } = res.data;
        localStorage.setItem("access", access);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
