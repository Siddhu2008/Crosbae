// src/contexts/PurityContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from "react";
import api from "../api/api"; // ✅ unified API instance

const PurityContext = createContext();

const initialState = {
  purities: [],
  loading: true,
  error: null,
};

function purityReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, purities: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const PurityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(purityReducer, initialState);

  useEffect(() => {
    const fetchPurities = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await api.get("/v1/inventory/purities/");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.results || res.data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchPurities();
  }, []);

  return (
    <PurityContext.Provider value={{ state, dispatch }}>
      {children}
    </PurityContext.Provider>
  );
};

export const usePurity = () => {
  const context = useContext(PurityContext);
  if (!context) throw new Error("usePurity must be used within a PurityProvider");
  return context;
};

export default PurityContext;
