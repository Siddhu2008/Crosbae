import axios from "axios";

const API_URL = "https://api.crosbae.com/api/wishlist/";

// ✅ GET wishlist
export const getWishlist = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ ADD to wishlist — now includes `customer`
export const addToWishlist = async (payload, token) => {
  try {
    const res = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("🛑 Wishlist Add Error:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ REMOVE from wishlist
export const removeFromWishlist = async (wishlistId, token) => {
  const res = await axios.delete(`${API_URL}${wishlistId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
