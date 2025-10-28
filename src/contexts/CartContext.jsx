import { createContext, useContext, useReducer, useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/api";
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
  const [addingMap, setAddingMap] = useState({});

  const fetchCart = async () => {
    if (!user) return;
    try {
      dispatch({ type: "FETCH_START" });
      const res = await api.get("/cart/");
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

    // prevent concurrent add requests for the same product
    if (addingMap[String(productId)]) return;
    setAddingMap((s) => ({ ...s, [String(productId)]: true }));

    try {
      // Fetch latest cart items from server to avoid race creating duplicate entries
      const res = await api.get("/cart/");
      const items = Array.isArray(res.data) ? res.data : res.data.results || [];

      let existingItem = items.find(
        (item) => String(item.product) === String(productId) || String(item.product?.id) === String(productId)
      );

      if (existingItem) {
        await updateCartItem(existingItem.id, existingItem.quantity + quantity);
      } else {
        try {
          await api.post("/cart/", { product: String(productId), quantity });
        } catch (err) {
          // If server rejects because the entry already exists (race), refresh cart instead of failing
          const status = err.response?.status;
          if (status === 409 || status === 400) {
            // likely duplicate unique constraint; fall through to refresh
          } else {
            throw err;
          }
        }
      }

      // refresh cart state after operation
      fetchCart();
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.response?.data?.detail || err.message || "Failed to add to cart",
      });
    } finally {
      setAddingMap((s) => {
        const c = { ...s };
        delete c[String(productId)];
        return c;
      });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await api.patch(`/cart/${itemId}/`, { quantity });
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
      await api.delete(`/cart/${itemId}/`);
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
