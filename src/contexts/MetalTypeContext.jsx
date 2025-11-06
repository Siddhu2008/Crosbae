// src/contexts/MetalTypeContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect, useContext } from "react";
import api from "../api/api"; // ✅ unified API instance

const MetalTypeContext = createContext();

const initialState = {
  metalTypes: [],
  loading: true,
  error: null,
};

function metalTypeReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, metalTypes: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const MetalTypeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(metalTypeReducer, initialState);

  useEffect(() => {
    const fetchMetalTypes = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await api.get("/v1/inventory/metal-types/");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.results || res.data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchMetalTypes();
  }, []);

  return (
    <MetalTypeContext.Provider value={{ state, dispatch }}>
      {children}
    </MetalTypeContext.Provider>
  );
};

export const useMetalType = () => {
  const context = useContext(MetalTypeContext);
  if (!context) throw new Error("useMetalType must be used within a MetalTypeProvider");
  return context;
};

export default MetalTypeContext;
