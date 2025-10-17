import axios from "axios";

const API_URL = "https://api.crosbae.com/api/wishlist/";

// ✅ GET wishlist
export const getWishlist = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ ADD to wishlist
export const addToWishlist = async (payload, token) => {
  const res = await axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ REMOVE from wishlist
export const removeFromWishlist = async (wishlistId, token) => {
  const res = await axios.delete(`${API_URL}${wishlistId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
