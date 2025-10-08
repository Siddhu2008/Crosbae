import axios from "axios";

const BASE_URL = "https://api.crosbae.com/api/auth";

// Fetch current user profile
export const getUserProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update user profile
export const updateUserProfile = async (data, token) => {
  const res = await axios.patch(`${BASE_URL}/user`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// (Optional) Fetch addresses
export const getUserAddresses = async (token) => {
  const res = await axios.get(`${BASE_URL}/addresses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};