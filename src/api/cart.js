// src/api/cart.js
import api from "./api";

// ✅ Get user's cart
export const getCart = async () => {
  try {
    const res = await api.get("/cart/");
    return res.data;
  } catch (error) {
    handleCartError(error, "fetching cart");
  }
};

// ✅ Add product to cart
export const addToCart = async ({ product, quantity }) => {
  try {
    const res = await api.post("/cart/", { product, quantity });
    return res.data;
  } catch (error) {
    handleCartError(error, "adding product to cart");
  }
};

// ✅ Update cart item
export const updateCartItem = async (cartItemId, { quantity }) => {
  try {
    const res = await api.patch(`/cart/${cartItemId}/`, { quantity });
    return res.data;
  } catch (error) {
    handleCartError(error, "updating cart item");
  }
};

// ✅ Delete cart item
export const deleteCartItem = async (cartItemId) => {
  try {
    const res = await api.delete(`/cart/${cartItemId}/`);
    return res.data;
  } catch (error) {
    handleCartError(error, "deleting cart item");
  }
};

// ✅ Centralized error handler for all cart operations
const handleCartError = (error, action = "performing action") => {
  if (error.response) {
    const { status, data } = error.response;

    // Common server-side validation error (like your current message)
    if (Array.isArray(data) && data.length > 0) {
      alert(data[0]);
    } else if (typeof data?.detail === "string") {
      alert(data.detail);
    } else if (status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    } else {
      alert(`Something went wrong while ${action}.`);
    }
  } else if (error.request) {
    alert("Network error. Please check your connection.");
  } else {
    alert(`Unexpected error: ${error.message}`);
  }

  // Optional: Log detailed info for debugging
  console.error(`Error ${action}:`, error);
};
