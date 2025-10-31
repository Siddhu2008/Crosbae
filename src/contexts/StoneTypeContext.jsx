// src/contexts/StoneTypeContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from "react";
import api from "../api/api"; // ✅ use global API instance

const StoneTypeContext = createContext();

const initialState = {
  stoneTypes: [],
  loading: true,
  error: null,
};

function stoneTypeReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, stoneTypes: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const StoneTypeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stoneTypeReducer, initialState);

  useEffect(() => {
    const fetchStoneTypes = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await api.get("/v1/inventory/stone-types/");
        dispatch({
          type: "FETCH_SUCCESS",
          payload: res.data.results || res.data,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err.message,
        });
      }
    };

    fetchStoneTypes();
  }, []);

  return (
    <StoneTypeContext.Provider value={{ state, dispatch }}>
      {children}
    </StoneTypeContext.Provider>
  );
};

export const useStoneType = () => {
  const context = useContext(StoneTypeContext);
  if (!context) throw new Error("useStoneType must be used within a StoneTypeProvider");
  return context;
};
