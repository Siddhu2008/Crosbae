import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import Seo from "./Seo";
import "../styles/WishlistPage.css";
import { updateCart } from "../api/cart";

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
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId, token);
      setWishlistItems((prev) =>
        prev.filter(
          (item) => item.product.id !== productId && item.id !== productId
        )
      );
    } catch (err) {
      alert("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await updateCart({ product: productId, quantity }, token);
      alert("1 item added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="wishlist-page ">
      <Seo
        title="My Wishlist"
        description="View and manage your wishlist at Cros Bae. Save your favorite imitation jewellery pieces and shop them later."
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
              <div className="wishlist-card" key={product.id}>
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="wishlist-img"
                />
                <div className="wishlist-info">
                  <h5>{product.productName}</h5>
                  <p className="wishlist-desc">{product.description}</p>
                  <p className="wishlist-price">₹ {product.price}</p>
                  <div className="wishlist-actions">
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(product.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn-cart"
                      onClick={() => handleAddToCart(product.id)}
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
