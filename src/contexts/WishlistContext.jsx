import { createContext, useContext, useEffect, useState } from "react";
/* eslint-disable react-refresh/only-export-components */
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await getWishlist();
        setWishlist(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const existing = wishlist.find((item) => item.product === product.id || item.product === product);
    try {
      if (existing) {
        await removeFromWishlist(existing.id);
        setWishlist((prev) => prev.filter((item) => item.id !== existing.id));
      } else {
        const newItem = await addToWishlist({ product: product.id || product });
        setWishlist((prev) => [...prev, newItem]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Create easy lookup object
  const wishlistProductIds = wishlist.reduce((acc, item) => {
    acc[item.product] = true;
    return acc;
  }, {});

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistProductIds, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => useContext(WishlistContext);
