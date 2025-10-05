import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../api/auth";

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
        const response = await axios.get(API_URL + "/api/v1/inventory/stone-types/");
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.results || response.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
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

export default StoneTypeContext;

export const useStoneType = () => {
  const context = useContext(StoneTypeContext);
  if (!context) throw new Error("useStoneType must be used within a StoneTypeProvider");
  return context;
};
