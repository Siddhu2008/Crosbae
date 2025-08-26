import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CartPage.css"; // custom css

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
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

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const discount = 1000;
  const shipping = 0;

  return (
    <div className="cart-container my-5">
      <h2 className="cart-title">Shopping Cart</h2>
      <p className="cart-subtitle">{cartItems.length} items in your cart</p>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-link">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                {/* LEFT: Image + Info */}
                <div className="cart-left">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="cart-img"
                  />

                  <div className="cart-info">
                    <h4 className="cart-name">{item.productName}</h4>
                    <p className="cart-sku">SKU: {item.sku}</p>
                    <p className="cart-price">
                      ₹{item.price}{" "}
                      {item.oldPrice && (
                        <span className="cart-oldprice">₹{item.oldPrice}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* RIGHT: Qty + Delete */}
                <div className="cart-right">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <div className="summary-line discount">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <hr />
            <div className="summary-line total">
              <span>Total</span>
              <span>₹{calculateSubtotal() - discount + shipping}</span>
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>
            <Link to="/shop" className="continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
