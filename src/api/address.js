// src/api/address.js
import api from "./api";

export const getAddresses = async () => {
  const res = await api.get("/auth/addresses/");
  return res.data;
};

export const addAddress = async (address) => {
  const res = await api.post("/auth/addresses/", address);
  return res.data;
};
