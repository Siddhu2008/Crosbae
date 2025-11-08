import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

/* eslint-disable react-refresh/only-export-components */
const CartContext = createContext();
import { API_URL } from "../api/api";
const initialState = {
  items: [],
  loading: false,
  initialized: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, initialized: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const token = localStorage.getItem("access");

  const fetchCart = async () => {
    if (!user) return;
    try {
      dispatch({ type: "FETCH_START" });
      const res = await axios.get(`${API_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch({ type: "FETCH_SUCCESS", payload: res.data.results || res.data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    await axios.post(
      `${API_URL}/cart/`,
      { product: String(productId), quantity },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );
    fetchCart();
  };

  const updateCartItem = async (itemId, quantity) => {
    await axios.patch(
      `${API_URL}/cart/${itemId}/`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );
    fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await axios.delete(`${API_URL}/cart/${itemId}/`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    fetchCart();
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const cartCount = state.items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ ...state, fetchCart, addToCart, updateCartItem, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
