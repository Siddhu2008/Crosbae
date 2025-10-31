// src/api/category.js
import api from "./api";

export const getCategories = async () => {
  try {
    const res = await api.get("/v1/inventory/categories/");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};
