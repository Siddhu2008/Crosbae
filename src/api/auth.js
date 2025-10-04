import axios from "axios";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://api.crosbae.com";

export const register = (userData) => {
  return axios.post(API_URL + "/api/auth/user/", userData);
};

export const login = (userData) => {
  return axios.post(API_URL + "/api/auth/login/", userData);
};

export const getCurrentUser = (token) => {
  return axios.get(API_URL + "/api/auth/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const refreshToken = (refresh) => {
  return axios.post(API_URL + "/api/auth/token/refresh/", { refresh });
};

export const googleLogin = (token) => {
  return axios.post(API_URL + "/api/auth/google/", { token });
};

export const getGoogleClientId = () => {
  return axios.get(API_URL + "/api/auth/google-client-id/");
};

export default API_URL;