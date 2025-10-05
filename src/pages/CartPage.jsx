import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CartPage.css"; // Make sure to update your CSS accordingly
import Seo from "../components/Seo";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

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

  const shipping = 0;

  // Sample coupon codes and their discount values
  const validCoupons = {
    SAVE1000: 1000,
    SAVE500: 500,
    DISCOUNT10: calculateSubtotal() * 0.1, // 10% discount
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
      setCouponError("");
    } else {
      setDiscount(0);
      setCouponError("Invalid coupon code.");
    }
  };

  return (
    <div className="cart-container container my-5">
      <Seo
        title="Shopping Cart"
        description="Review your shopping cart at Cros Bae. Proceed to checkout to purchase your selected imitation jewellery items."
        keywords="shopping cart, my cart, jewellery checkout, view bag"
      />
      <h2 className="cart-title text-center my-3">Shopping Cart</h2>
      <p className="cart-subtitle text-center">{cartItems.length} items in your cart</p>

      {cartItems.length === 0 ? (
        <div className="cart-empty text-center">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={`${item.id}-${index}`}>
                {/* LEFT: Image + Info */}
                <div className="cart-left">
                  <img src={item.images?.[0]} alt={item.productName} className="cart-img" />


                  <div className="cart-info">
                    <h4 className="cart-name">{item.productName}</h4>
                    <p className="cart-sku">SKU: {item.sku}</p>
                    <p className="cart-price">
                      ₹{item.price}{" "}
                      {item.oldPrice && <span className="cart-oldprice">₹{item.oldPrice}</span>}
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

                  <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar with Coupon + Order Summary */}
          <div className="cart-sidebar">
            {/* Coupon Box */}
            <div className="coupon-box">
              <div className="coupon-header">
                <span role="img" aria-label="gift">
                  🎁
                </span>{" "}
                Have a coupon?
              </div>
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {couponError && <p className="coupon-error">{couponError}</p>}
              {discount > 0 && !couponError && (
                <p className="coupon-success">Coupon applied! You saved ₹{discount.toFixed(2)}.</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-line discount">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <hr />
              <div className="summary-line total">
                <span>Total</span>
                <span>₹{(calculateSubtotal() - discount + shipping).toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="btn checkout-btn">Proceed to Checkout</Link>
              <Link to="/shop" className="continue-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
         