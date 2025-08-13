import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import products from "../data/products";
// import "../styles/WishlistPage.css"; // Create or reuse styling

export default function WishlistPage() {
  const [likedProducts, setLikedProducts] = useState([]);

  // Simulate loading wishlist from localStorage or global state
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
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...existingCart, { ...product, quantity: 1 }];
  }

  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
};

  return (
    <div className="container " style={{paddingTop:"120px",paddingBottom:"100px"}}>
      <h2 className="mb-4 text-center">My Wishlist </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {wishlistItems.map((item) => (
            <div className="col" key={item.id}>
              <div className="card h-100 shadow-sm position-relative">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.productName}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.productName}</h5>
                  <p className="card-text text-muted small">
                    {item.description}
                  </p>
                  <p className="fw-semibold">₹ {item.price}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                    <button className="btn btn-dark" onClick={() => addToCart(item)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
