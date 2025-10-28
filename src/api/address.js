import api from './api';

export const getAddresses = async () => {
  const res = await api.get('/auth/addresses/');
  return res.data;
};

export const addAddress = async (address) => {
  const res = await api.post('/auth/addresses/', address);
  return res.data;
};

export const updateAddress = async (id, patch) => {
  const res = await api.patch(`/auth/addresses/${id}/`, patch);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/auth/addresses/${id}/`);
  return res.data;
};