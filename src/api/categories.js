import axios from "axios";

const API_URL = "https://api.crosbae.com/api/v1/inventory/"; 

export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}categories/`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};
