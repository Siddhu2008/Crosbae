import axios from 'axios';

const API_URL = 'https://api.crosbae.com/api/cart/';

export const getCart = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCart = async ({ product, quantity }, token) => {
  const res = await axios.post(API_URL, { product, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};