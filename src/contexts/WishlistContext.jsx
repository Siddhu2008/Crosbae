import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist if user is logged in
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
      window.location.href = "/login"; // redirect if not logged in
      return;
    }

    const existing = wishlist.find((item) => {
      if (!item) return false;
      const itemProduct = typeof item.product === "object" && item.product !== null ? (item.product.id ?? item.product.pk ?? item.product) : item.product;
      const prodId = product?.id ?? product;
      return itemProduct == prodId; // loose equality to compare string/number ids
    });
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

  // Map of productId -> true for quick lookups by UI components
  const wishlistProductIds = useMemo(() => {
    const map = {};
    wishlist.forEach((item) => {
      if (!item) return;
      // item.product may be an id or an object
      let pid = null;
      if (typeof item.product === "object" && item.product !== null) {
        pid = item.product.id ?? item.product.pk ?? null;
      } else {
        pid = item.product ?? item.product_id ?? null;
      }
      if (pid !== null && pid !== undefined) map[pid] = true;
    });
    return map;
  }, [wishlist]);
  return (
    <WishlistContext.Provider value={{ wishlist, wishlistProductIds, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
