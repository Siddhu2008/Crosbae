// src/api/user.js
import axios from "axios";

const BASE_URL = "https://api.crosbae.com/api/auth";

// ✅ Fetch current user profile
export const getUserProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetched user profile:", res.data);
  return res.data;
};

// ✅ Update user profile with user ID in the URL
export async function updateUserProfile(userId, data, token) {
  const url = `${BASE_URL}/user/${userId}/`;

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ If FormData is used (file upload)
  if (data instanceof FormData) {
    // do NOT set content-type
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  const res = await axios.put(url, data, config);

  return res.data;
}


// ✅ Fetch user addresses (optional)
export const getUserAddresses = async (token) => {
  const res = await axios.get(`${BASE_URL}/addresses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
