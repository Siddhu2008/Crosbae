"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
// import axios from "axios";
// import API_URL from "../api/auth";
import api from "../api/api";

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
      return {
        ...state,
        loading: false,
        brands: action.payload.brands,
        purities: action.payload.purities,
        categories: action.payload.categories,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CatalogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(catalogReducer, initialState);

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        dispatch({ type: "FETCH_START" });

        const [brandRes, purityRes, categoryRes] = await Promise.all([
          api.get("/api/v1/inventory/brands/"),
          api.get("/api/v1/inventory/purities/"),
          api.get("/api/v1/inventory/categories/"),
        ]);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            brands: brandRes.data.results || brandRes.data,
            purities: purityRes.data.results || purityRes.data,
            categories: categoryRes.data.results || categoryRes.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload:
            error.response?.data?.detail ||
            error.message ||
            "Failed to load catalog data",
        });
      }
    };

    fetchCatalogData();
  }, []);

  return (
    <CatalogContext.Provider value={state}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => useContext(CatalogContext);
