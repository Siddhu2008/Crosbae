import axios from 'axios';

const API_URL = 'https://api.crosbae.com/api/auth/addresses/';

export const getAddresses = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addAddress = async (address, token) => {
  const res = await axios.post(API_URL, address, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};