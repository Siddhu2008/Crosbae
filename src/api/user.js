// src/api/user.js
import axios from "axios";
import API_URL from "./auth";

const BASE_URL = API_URL+"/auth";



export const getUserProfile = async (token) => {
  const res = await axios.get(`${API_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const updateUserProfile = async (id, data, token) => {
  // For FormData, let the browser set the Content-Type automatically with boundary
  // For JSON, we'll set Content-Type explicitly
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Only set Content-Type for JSON data, not for FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await axios.patch(`${API_URL}/api/auth/user/${id}/`, data, {
      headers,
      // Add timeout to prevent hanging requests
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    console.error("API Error in updateUserProfile:", error);
    throw error;
  }
};

// ✅ Fetch user addresses (optional)
export const getUserAddresses = async (token) => {
  const res = await axios.get(`${BASE_URL}/api/addresses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
