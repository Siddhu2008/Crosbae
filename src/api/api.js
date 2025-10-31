import axios from "axios";
import { refreshToken as refreshTokenAPI } from "./auth";

// const API_URL = "http://127.0.0.1:8000/api"; // dev
const API_URL = "https://api.crosbae.com/api"; // prod

export { API_URL };

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Auto-refresh on 401
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
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest); // retry
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
