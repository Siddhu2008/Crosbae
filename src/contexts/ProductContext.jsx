// src/contexts/ProductContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from "react";
import api from "../api/api"; // ✅ unified API instance

const ProductContext = createContext();

const initialState = {
  products: [],
  loading: true,
  error: null,
};

function productReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await api.get("/v1/inventory/products/");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.results || res.data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used within a ProductProvider");
  return context;
};

export default ProductContext;
