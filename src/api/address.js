import api from './api';

export const getAddresses = async () => {
  const res = await api.get('/api/auth/addresses/');
  return res.data;
};

export const addAddress = async (address) => {
  const res = await api.post('/api/auth/addresses/', address);
  return res.data;
};

export const updateAddress = async (id, patch) => {
  const res = await api.patch(`/api/auth/addresses/${id}/`, patch);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/api/auth/addresses/${id}/`);
  return res.data;
};