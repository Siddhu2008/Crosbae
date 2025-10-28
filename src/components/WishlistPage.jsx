import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "../styles/WishlistPage.css";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../contexts/ProductContext";

export default function WishlistPage() {
  const { wishlistProductIds = {}, toggleWishlist, loading } = useWishlist();
const { addToCart } = useCart();
const { state: productState } = useProduct();
const allProducts = productState.products || [];

const wishlistProducts = allProducts.filter((p) => wishlistProductIds[p.id]);

  // Show loader while fetching wishlist or products
  if (loading || productState.loading) {
    return (
      <div className="wishlist-loading text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Seo
        title="My Wishlist"
        description="View and manage your wishlist at Cros Bae."
        keywords="wishlist, my wishlist, favorite jewellery, saved items"
      />
      <h2 className="wishlist-title">My Wishlist</h2>

      {wishlistProducts.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistProducts.map((product) => {
            const imgUrl =
              product.images && product.images.length > 0
                ? product.images[0].url_full || product.images[0].url || "/fallback-image.jpg"
                : "/fallback-image.jpg";

            const shortDescription = (product.description || "")
              .split(" ")
              .slice(0, 5)
              .join(" ") + ((product.description || "").split(" ").length > 5 ? "..." : "");

            return (
              <div className="wishlist-card" key={product.id}>
                <img
                  src={imgUrl}
                  alt={product.productName || product.name || "Wishlist product"}
                  className="wishlist-img"
                />
                <div className="wishlist-info">
                  <h5>{product.productName || product.name || "Unnamed Product"}</h5>
                  <p className="wishlist-desc">{shortDescription}</p>
                  <p className="wishlist-price">₹ {product.price?.toLocaleString() || "N/A"}</p>
                  <div className="wishlist-actions">
                    <button className="btn-remove" onClick={() => toggleWishlist(product)}>
                      Remove
                    </button>
                    <button className="btn-cart" onClick={() => addToCart(product.id)}>
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
