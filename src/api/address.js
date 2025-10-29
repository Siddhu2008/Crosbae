import axios from 'axios';
import API_URL from './auth';

const BASE_URL = API_URL+'/api/auth/addresses/';

export const getAddresses = async (token) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addAddress = async (address, token) => {
  const res = await axios.post(BASE_URL, address, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};