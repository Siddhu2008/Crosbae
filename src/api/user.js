// src/api/user.js
import api from "./api";

export const getUserProfile = async () => {
  const res = await api.get("/auth/me/");
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  try {
    const headers = {};
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await api.patch(`/auth/user/${id}/`, data, { headers });
    return res.data;
  } catch (error) {
    console.error("API Error in updateUserProfile:", error);
    throw error;
  }
};

export const getUserAddresses = async () => {
  const res = await api.get("/auth/addresses/");
  return res.data;
};
