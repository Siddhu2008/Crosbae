import React, { createContext, useContext, useReducer, useEffect } from "react";
/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { API_URL } from "../api/api";
const CatalogContext = createContext();

const initialState = {
  brands: [],
  purities: [],
  categories: [],
  loading: false,
  error: null,
};

function catalogReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, ...action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CatalogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(catalogReducer, initialState);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const [brands, purities, categories] = await Promise.all([
          axios.get(`${API_URL}/v1/inventory/brands/`),
          axios.get(`${API_URL}/v1/inventory/purities/`),
          axios.get(`${API_URL}/v1/inventory/categories/`),
        ]);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            brands: brands.data.results || brands.data,
            purities: purities.data.results || purities.data,
            categories: categories.data.results || categories.data,
          },
        });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };
    fetchAll();
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => useContext(CatalogContext);
