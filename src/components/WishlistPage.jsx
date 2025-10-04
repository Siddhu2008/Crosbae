import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import products from "../data/products";
import Seo from "./Seo";
import "../styles/WishlistPage.css"; // new stylesheet

export default function WishlistPage() {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(storedLikes);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedLikes = likedProducts.filter((pid) => pid !== id);
    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
  };

  const wishlistItems = products.filter((product) =>
    likedProducts.includes(product.id)
  );

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const exists = existingCart.find((item) => item.id === product.id);

    let updatedCart;
    if (exists) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    alert("1 item added to cart");
  };

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
          {wishlistItems.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <img
                src={item.images?.[0]}
                alt={item.productName}
                className="wishlist-img"
              />
              <div className="wishlist-info">
                <h5>{item.productName}</h5>
                <p className="wishlist-desc">{item.description}</p>
                <p className="wishlist-price">₹ {item.price}</p>
                <div className="wishlist-actions">
                  <button
                    className="btn-remove"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                  <button className="btn-cart" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
