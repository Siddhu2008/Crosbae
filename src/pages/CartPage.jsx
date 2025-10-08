import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import Seo from "../components/Seo";
import API_URL from "../api/auth"; // 👈 import your base API URL
import { useAuth } from "../contexts/AuthContext"; // 👈 for authenticated requests

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [showAddressSection, setShowAddressSection] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressError, setAddressError] = useState(null);

  const { token } = useAuth(); // assumes token is exposed from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
    fetchCoupons();
    fetchAddresses();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      setAvailableCoupons(data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/addresses/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();

      const addrList = Array.isArray(data)
        ? data
        : data.results || [];

      setAddresses(addrList);
      // Auto-select default address if available
      const defaultAddress = addrList.find((addr) => addr.is_default);
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddressError("Unable to load addresses.");
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updated = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const shipping = 0;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const found = availableCoupons.find(
      (c) => c.code && c.code.toUpperCase() === code
    );
    if (found) {
      let disc = 0;
      if (found.discount_amount != null) {
        disc = found.discount_amount;
      } else if (found.discount_percent != null) {
        disc = (calculateSubtotal() * found.discount_percent) / 100;
      }
      setDiscount(disc);
      setCouponError("");
    } else {
      setDiscount(0);
      setCouponError("Invalid coupon code.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToCheckout = () => {
    setShowAddressSection(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select an address before placing the order.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      const orderRes = await fetch("/api/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round((calculateSubtotal() - discount + shipping) * 100),
          currency: "INR",
          address_id: selectedAddressId,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      const orderData = await orderRes.json();
      const { id: order_id, amount, currency, key } = orderData;

      const options = {
        key,
        amount: amount.toString(),
        currency,
        name: "Cros Bae",
        description: "Jewellery Purchase",
        order_id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/verify-payment/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const verifyData = await verifyRes.json();
          console.log("Payment verified:", verifyData);
          navigate("/order-success");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#d1a054",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error("Payment failed:", resp.error);
        alert("Payment failed: " + resp.error.description);
      });

      rzp.open();
    } catch (err) {
      console.error("Error in payment flow:", err);
      alert("Unable to process payment. Please try again.");
    }
  };

  return (
    <div className="cart-container container my-5">
      <Seo title="Shopping Cart" description="View your Cros Bae cart" />

      <h2 className="cart-title text-center my-3">Shopping Cart</h2>
      <p className="cart-subtitle text-center">{cartItems.length} items in your cart</p>

      {cartItems.length === 0 ? (
        <div className="cart-empty text-center">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">Browse Jewellery</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item, idx) => (
              <div className="cart-item" key={`${item.id}-${idx}`}>
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
                <div className="cart-right">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            {/* Coupon Box */}
            <div className="coupon-box">
              <div className="coupon-header">🎁 Have a coupon?</div>
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
                <p className="coupon-success">Coupon applied! You saved ₹{discount.toFixed(2)}</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line"><span>Subtotal</span><span>₹{calculateSubtotal().toFixed(2)}</span></div>
              <div className="summary-line discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
              <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <hr />
              <div className="summary-line total"><span>Total</span><span>₹{(calculateSubtotal() - discount + shipping).toFixed(2)}</span></div>

              {!showAddressSection && (
                <button className="btn checkout-btn" onClick={handleProceedToCheckout}>
                  Proceed to Checkout
                </button>
              )}
            </div>

            {/* Address Section */}
            {showAddressSection && (
              <div className="address-section mt-4">
                <h4>Select Shipping Address</h4>
                {addressError ? (
                  <p className="text-danger">{addressError}</p>
                ) : addresses.length === 0 ? (
                  <p>No saved addresses found.</p>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="address-option">
                      <label>
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <span>
                          <strong>{addr.title}</strong>: {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                        </span>
                      </label>
                    </div>
                  ))
                )}
                <button
                  className="btn btn-secondary mt-2 m-2"
                  onClick={() => navigate("/add-address")}
                >
                  ➕ Add New Address
                </button>
                <button
                  className="btn btn-primary mt-3 m-2"
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddressId}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
