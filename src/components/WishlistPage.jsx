import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { addToCart } from "../api/cart";
import Seo from "./Seo";
import "../styles/WishlistPage.css";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist(token);
        setWishlistItems(data.results || data);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token]);

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId, token);
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
    } catch (err) {
      alert("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId, wishlistId, quantity = 1) => {
    try {
      await addToCart({ product: productId, quantity }, token);
      await handleRemove(wishlistId);
      alert("Item moved to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="wishlist-page">
      <Seo
        title="My Wishlist"
        description="View and manage your wishlist at Cros Bae."
        keywords="wishlist, my wishlist, favorite jewellery, saved items"
      />
      <h2 className="wishlist-title">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            return (
              <div className="wishlist-card" key={item.id}>
                <img
                  src={product.images?.[0]?.url_full || "/fallback-image.jpg"}
                  alt={product.productName || product.name}
                  className="wishlist-img"
                />
                <div className="wishlist-info">
                  <h5>{product.productName || product.name}</h5>
                  <p className="wishlist-desc">{product.description}</p>
                  <p className="wishlist-price">₹ {product.price}</p>
                  <div className="wishlist-actions">
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn-cart"
                      onClick={() => handleAddToCart(product.id, item.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
