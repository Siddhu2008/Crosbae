import api from "./api";

export const getWishlist = async () => {
  const res = await api.get("/api/wishlist/");
  return res.data;
};

export const addToWishlist = async (payload) => {
  const res = await api.post("/api/wishlist/", payload);
  return res.data;
};

export const removeFromWishlist = async (id) => {
  const res = await api.delete(`/api/wishlist/${id}/`);
  return res.data;
};
