import { useEffect, useState } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";

export default function useWishlist(token) {
  const [wishlistProductIds, setWishlistProductIds] = useState({});

  useEffect(() => {
    if (!token) return;

    const fetchWishlistData = async () => {
      try {
        const data = await getWishlist(token);
        const items = Array.isArray(data) ? data : data.results || [];
        const wishlistMap = {};
        items.forEach(item => {
          wishlistMap[item.product.id] = item.id;
        });
        setWishlistProductIds(wishlistMap);
      } catch (err) {
        console.error("❌ Failed to load wishlist:", err);
        if (err?.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("access");
          window.location.href = "/login";
        }
        setWishlistProductIds({});
      }
    };

    fetchWishlistData();
  }, [token]);

  const toggleWishlist = async (product) => {
    if (!token) {
      alert("Please login to use wishlist.");
      return;
    }

    const existingWishlistId = wishlistProductIds[product.id];

    try {
      if (existingWishlistId) {
        await removeFromWishlist(existingWishlistId, token);
        setWishlistProductIds(prev => {
          const updated = { ...prev };
          delete updated[product.id];
          return updated;
        });
      } else {
       const newItem = await addToWishlist({ product: product.id }, token);

        if (newItem && newItem.id) {
          setWishlistProductIds(prev => ({
            ...prev,
            [product.id]: newItem.id,
          }));
        }
      }
    } catch (err) {
      console.error("❌ Wishlist error:", err);
      if (err?.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("access");
        window.location.href = "/login";
      } else {
        alert("Wishlist action failed.");
      }
    }
  };

  return { wishlistProductIds, toggleWishlist };
}
