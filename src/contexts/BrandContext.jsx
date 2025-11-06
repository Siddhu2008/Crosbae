/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../api/api";

const BrandContext = createContext();

const initialState = { brands: [], loading: true, error: null };

function brandReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, brands: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const BrandProvider = ({ children }) => {
  const [state, dispatch] = useReducer(brandReducer, initialState);

  useEffect(() => {
    const fetchBrands = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await axios.get(`${API_URL}/v1/inventory/brands/`);
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.results || res.data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };
    fetchBrands();
  }, []);

  return <BrandContext.Provider value={state}>{children}</BrandContext.Provider>;
};

export const useBrand = () => useContext(BrandContext);
