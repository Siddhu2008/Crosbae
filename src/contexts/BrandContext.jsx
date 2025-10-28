import React, { createContext, useReducer, useEffect } from "react";
// import axios from "axios";
// import API_URL from "../api/auth";
import api from "../api/api";
import { useContext } from "react";
const BrandContext = createContext();

const initialState = {
  brands: [],
  loading: true,
  error: null,
};

function brandReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
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
        const response = await api.get("/v1/inventory/brands/");
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.results || response.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider value={{ state, dispatch }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
