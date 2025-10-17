import axios from "axios";

const API_URL = "https://api.crosbae.com/api/cart/";

export const getCart = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addToCart = async ({ product, quantity }, token) => {
  const res = await axios.post(API_URL, { product, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCartItem = async (cartItemId, { quantity }, token) => {
  const res = await axios.patch(`${API_URL}${cartItemId}/`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteCartItem = async (cartItemId, token) => {
  const res = await axios.delete(`${API_URL}${cartItemId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
