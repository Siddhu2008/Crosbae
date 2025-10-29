import axios from "axios";
const API_URL = "https://api.crosbae.com";

export const register = (userData) => axios.post(`${API_URL}/api/auth/user/`, userData);

export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/api/auth/login/`, userData);
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("access");
  return axios.get(`${API_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const refreshToken = (refresh) => axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh });

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
};

export const googleLogin = (token) => axios.post(`${API_URL}/api/auth/google/`, { token });
export const getGoogleClientId = () => axios.get(`${API_URL}/api/auth/google-client-id/`);

export default API_URL;
