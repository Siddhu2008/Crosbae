import axios from 'axios';

const API_URL = 'https://api.crosbae.com/api/wishlist';

export const getWishlist = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addToWishlist = async (item, token) => {
  const res = await axios.post(API_URL, item, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const removeFromWishlist = async (productId, token) => {
  // Assuming your API uses DELETE /api/wishlist/{productId}/
  const url = `${API_URL}/${productId}/`;
  const res = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};