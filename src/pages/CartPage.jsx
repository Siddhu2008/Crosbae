import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import products from "../data/products"; // Your product dataset

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <h2 className="mb-4 text-center">My Shopping Cart </h2>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div className="card mb-3 shadow-sm" key={item.id}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={item.image}
                      className="img-fluid"
                      alt={item.productName}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </div>
                  <div className="col-md-8 d-flex flex-column p-3">
                    <h5>{item.productName}</h5>
                    <p className="text-muted small">{item.description}</p>
                    <p className="fw-semibold">₹ {item.price}</p>
                    <div className="d-flex align-items-center gap-3">
                      <label>Qty:</label>
                      <input
                        type="number"
                        className="form-control w-25"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                      />
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3">Order Summary</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: ₹ {calculateTotal()}</p>
              <Link to="/checkout" className="btn btn-dark w-100">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
