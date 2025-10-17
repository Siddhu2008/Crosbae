import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import Seo from "../components/Seo";
import API_URL from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";
import ProductContext from "../contexts/ProductContext";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../api/cart";

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
  const [currentUser, setCurrentUser] = useState(null);

  const { fetchWithAuth } = useContext(AuthContext);
  const { state } = useContext(ProductContext);
  const { products } = state;

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    if (token) fetchUser();
  }, [token]);

  // Load cart, coupons, addresses
  useEffect(() => {
    if (products?.length > 0) fetchCart();
    fetchCoupons();
    if (token) fetchAddresses();
  }, [products, currentUser]);

  const fetchCart = async () => {
    try {
      const data = await getCart(token);
      const items = Array.isArray(data) ? data : data.results || [];
      const enriched = items.map((item) => {
        const productDetail = products.find((p) => p.id === item.product);
        return { ...item, product: productDetail || { id: item.product } };
      });
      setCartItems(enriched);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(API_URL + "/api/coupons/");
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      const coupons = Array.isArray(data) ? data : data.results || [];
      setAvailableCoupons(coupons);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetchWithAuth(API_URL + "/api/auth/addresses/");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      const addrList = Array.isArray(data) ? data : data.results || [];

      // ✅ Filter addresses to show only the logged-in user's
      const filtered = currentUser
        ? addrList.filter((addr) => addr.customer === currentUser.id)
        : addrList;

      setAddresses(filtered);
      const defaultAddress = filtered.find((addr) => addr.is_default);
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
    } catch (err) {
      setAddressError("Unable to load addresses.");
      console.error("Error fetching addresses:", err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/addresses/${addressId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
        if (selectedAddressId === addressId) setSelectedAddressId(null);
      } else {
        alert("Failed to delete address.");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Error deleting address.");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, { quantity: newQuantity }, token);
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
      alert("Failed to update cart quantity");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId, token);
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
      alert("Failed to remove item from cart");
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );

  const shipping = 0;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const found = availableCoupons.find(
      (c) => c.code && c.code.toUpperCase() === code
    );
    if (found) {
      const subtotal = calculateSubtotal();
      if (found.min_order_amount && subtotal < Number(found.min_order_amount)) {
        setDiscount(0);
        setCouponError(
          `Minimum order amount for this coupon is ₹${found.min_order_amount}`
        );
        return;
      }
      let disc = 0;
      if (found.discount_type === "fixed_amount") {
        disc = Number(found.discount_value);
        if (
          found.max_discount_amount &&
          disc > Number(found.max_discount_amount)
        ) {
          disc = Number(found.max_discount_amount);
        }
      } else if (found.discount_type === "percentage") {
        disc = (subtotal * Number(found.discount_value)) / 100;
        if (
          found.max_discount_amount &&
          disc > Number(found.max_discount_amount)
        ) {
          disc = Number(found.max_discount_amount);
        }
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
          Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
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
          name: currentUser?.username || "Customer",
          email: currentUser?.email || "",
        },
        theme: { color: "#d1a054" },
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
      <p className="cart-subtitle text-center">
        {cartItems.length} items in your cart
      </p>

      {cartItems.length === 0 ? (
        <div className="cart-empty text-center">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-left">
                  <img
                    src={item.product.images?.[0]?.url_full || "/fallback-image.jpg"}
                    alt={item.product.name}
                    className="cart-img"
                  />
                  <div className="cart-info">
                    <h4>{item.product?.name || "Product not found"}</h4>
                    <p>SKU: {item.product?.SKU_ProductID || "N/A"}</p>
                    <p>₹{item.product?.price || 0}</p>
                  </div>
                </div>
                <div className="cart-right">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            {/* Coupon Section */}
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
              {couponError && (
                <p className="coupon-error">{couponError}</p>
              )}
              {!couponError && couponCode.trim() && (
                <p className="coupon-success">
                  Coupon applied! You saved ₹{discount.toFixed(2)}
                </p>
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
                <span>
                  ₹{(calculateSubtotal() - discount + shipping).toFixed(2)}
                </span>
              </div>
              {!showAddressSection && (
                <button
                  className="btn checkout-btn"
                  onClick={handleProceedToCheckout}
                >
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
                    <div
                      key={addr.id}
                      className="address-option"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label style={{ flex: 1 }}>
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          style={{ marginRight: "10px" }}
                        />
                        <span>
                          <strong>{addr.title}</strong>: {addr.address_line1},{" "}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </span>
                      </label>
                      <div className="address-actions">
                        <button
                          className="profile-btn small"
                          onClick={() =>
                            navigate(`/edit-address/${addr.id}?redirectTo=cart`)
                          }
                          style={{ marginRight: "8px" }}
                        >
                          ✏️
                        </button>
                        <button
                          className="profile-btn small delete"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button
                  className="btn btn-secondary mt-2 m-2"
                  onClick={() => navigate("/add-address?redirectTo=cart")}
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
