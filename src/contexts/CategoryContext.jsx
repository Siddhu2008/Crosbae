import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../api/auth";

const CategoryContext = createContext();

const initialState = {
  categories: [],
  loading: true,
  error: null,
};

function categoryReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await axios.get(API_URL + "/v1/inventory/categories/");
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.results || response.data,
        });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
};

// ✅ Add this custom hook for easy access in any component
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export default CategoryContext;
