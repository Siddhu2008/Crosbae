import axios from "axios";
import API_URL from "./auth";

const BASE_URL = API_URL+"/api/v1/inventory/"; 

export const getCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}categories/`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};
