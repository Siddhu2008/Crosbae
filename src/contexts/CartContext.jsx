import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
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
  const token = user ? localStorage.getItem("access") : null;
  const API_URL = "https://api.crosbae.com";

  const fetchCart = async () => {
    if (!user) return;
    try {
      dispatch({ type: "FETCH_START" });
      const res = await axios.get(`${API_URL}/api/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : res.data.results || [];
      dispatch({ type: "FETCH_SUCCESS", payload: items });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.response?.data?.detail || err.message || "Failed to load cart",
      });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      window.location.href = "/login"; // redirect if not logged in
      return;
    }

    try {
      const existingItem = state.items.find(
        (item) => item.product === String(productId) || item.product.id === String(productId)
      );

      if (existingItem) {
        await updateCartItem(existingItem.id, existingItem.quantity + quantity);
      } else {
        await axios.post(
          `${API_URL}/api/cart/`,
          { product: String(productId), quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchCart(); // refresh cart
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.response?.data?.detail || err.message || "Failed to add to cart",
      });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await axios.patch(
        `${API_URL}/api/cart/${itemId}/`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.response?.data?.detail || err.message || "Failed to update cart",
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.response?.data?.detail || err.message || "Failed to remove item",
      });
    }
  };

  const cartCount = state.items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    if (user) fetchCart();
    else dispatch({ type: "FETCH_SUCCESS", payload: [] }); // clear cart if logged out
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        cartCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
