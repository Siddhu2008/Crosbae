import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../api/auth";

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
        const response = await axios.get(API_URL + "/api/v1/inventory/purities/");
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.results || response.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
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

export default PurityContext;

// Custom hook for easy access
export const usePurity = () => {
  const context = useContext(PurityContext);
  if (!context) {
    throw new Error("usePurity must be used within a PurityProvider");
  }
  return context;
};
