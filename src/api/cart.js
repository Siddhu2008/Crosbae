// src/api/cart.js
import api from "./api";

export const getCart = async () => {
  const res = await api.get("/api/cart/");
  return res.data;
};

export const addToCart = async ({ product, quantity }) => {
  const res = await api.post("/api/cart/", { product, quantity });
  return res.data;
};

export const updateCartItem = async (cartItemId, { quantity }) => {
  const res = await api.patch(`/api/cart/${cartItemId}/`, { quantity });
  return res.data;
};

export const deleteCartItem = async (cartItemId) => {
  const res = await api.delete(`/api/cart/${cartItemId}/`);
  return res.data;
};
