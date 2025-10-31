import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api"; // dev
const API_URL = "https://api.crosbae.com/api"; // prod

export const register = (userData) => {
  return axios.post(`${API_URL}/auth/user/`, userData);
};

export const login = async (userData) => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  const res = await axios.post(`${API_URL}/auth/login/`, userData);
  const { access, refresh } = res.data;
  console.log(res.data)
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  return res.data;
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("access");
  return axios.get(`${API_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const refreshToken = (refresh) => {
  return axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
};

// Optional Google Auth
export const googleLogin = (token) => {
  return axios.post(`${API_URL}/auth/google/`, { token });
};

export const getGoogleClientId = () => {
  return axios.get(`${API_URL}/auth/google-client-id/`);
};

export default API_URL;
