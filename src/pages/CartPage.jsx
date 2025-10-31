
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import Seo from "../components/Seo";
import API_URL from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import ProductContext from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import Swal from "sweetalert2";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressError, setAddressError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Use Cart Context
  const { 
    items: cartItems, 
    loading: cartLoading, 
    error: cartError,
    updateCartItem,
    removeFromCart,
    fetchCart 
  } = useCart();

  const { fetchWithAuth } = useAuth();
  const { state } = useContext(ProductContext);
  const { products } = state;

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me/`, {
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

  // Load coupons and addresses
  useEffect(() => {
    fetchCoupons();
    if (token) fetchAddresses();
  }, [currentUser]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(API_URL + "/coupons/");
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
      const res = await fetchWithAuth(API_URL + "/auth/addresses/");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      const addrList = Array.isArray(data) ? data : data.results || [];

      // Filter addresses to show only the logged-in user's
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
      const res = await fetch(`${API_URL}/auth/addresses/${addressId}/`, {
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

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (err) {
      console.error("Error updating cart:", err);
      alert("Failed to update cart quantity");
    }
  };


  const handleRemoveFromCart = async (cartItemId) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: "Are you sure you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      await removeFromCart(cartItemId);
      Swal.fire("Removed!", "The item has been removed from your cart.", "success");
    } catch (err) {
      console.error("Error removing from cart:", err);
      Swal.fire("Error", "Failed to remove item from cart.", "error");
    }
  };


  // Enrich cart items with product details
  const enrichedCartItems = cartItems.map((item) => {
    const productDetail = products?.find((p) => p.id === item.product) || {};
    return { ...item, product: productDetail };
  });

  const calculateSubtotal = () =>
    enrichedCartItems.reduce(
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
    setShowAddressModal(true);
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
      const orderRes = await fetch(`${API_URL}/checkout/create_order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: selectedAddressId,
          coupon_code: couponCode.trim() || null,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      const orderData = await orderRes.json();
      const { razorpay_order_id, amount, currency, razorpay_key, order_uuid } = orderData;

      const options = {
        key: razorpay_key,
        amount: amount * 100,
        currency: currency,
        name: "Cros Bae",
        description: "Jewellery Purchase",
        order_id: razorpay_order_id,
        handler: async function (response) {
          const verifyRes = await fetch(`${API_URL}/verify-payment/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_uuid: order_uuid,
            }),
          });

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const verifyData = await verifyRes.json();
          console.log("Payment verified:", verifyData);
          navigate(`/order/${order_uuid}`);
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

  // Loader Component
  const Loader = ({ type = "default" }) => (
    <div className={`loader ${type}`}>
      <div className="spinner"></div>
      <p>
        {type === "cart" && "Loading your cart..."}
        {type === "payment" && "Processing your order..."}
        {type === "addresses" && "Loading addresses..."}
        {!["cart", "payment", "addresses"].includes(type) && "Loading..."}
      </p>
    </div>
  );

  return (
    <>
      <div className="cart-container container my-5">
        <Seo title="Shopping Cart" description="View your Cros Bae cart" />

        <h2 className="cart-title text-center my-3">Shopping Cart</h2>
        
        {cartLoading ? (
          <Loader type="cart" />
        ) : cartError ? (
          <div className="cart-error text-center">
            <p>Error loading cart: {cartError}</p>
            <button onClick={fetchCart} className="btn btn-outline-primary">
              Retry
            </button>
          </div>
        ) : enrichedCartItems.length === 0 ? (
          <div className="cart-empty text-center">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-outline-primary">
              Browse Jewellery
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {enrichedCartItems.map((item) => (
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
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveFromCart(item.id)}
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
                {!couponError && couponCode.trim() && discount > 0 && (
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
                <button
                  className="btn checkout-btn"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Selection Modal - MOVED OUTSIDE MAIN CONTAINER */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Shipping Address</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowAddressModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {addressError ? (
                <p className="text-danger">{addressError}</p>
              ) : addresses.length === 0 ? (
                <div className="no-addresses">
                  <p>No saved addresses found.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowAddressModal(false);
                      navigate("/add-address?redirectTo=cart");
                    }}
                  >
                    ➕ Add New Address
                  </button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                    >
                      <label>
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="address-details">
                          <strong>{addr.title}</strong>
                          <p>
                            {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                            {addr.is_default && <span className="default-badge">Default</span>}
                          </p>
                        </div>
                      </label>
                      <div className="address-actions">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setShowAddressModal(false);
                            navigate(`/edit-address/${addr.id}?redirectTo=cart`);
                          }}
                          title="Edit address"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteAddress(addr.id)}
                          title="Delete address"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddressModal(false);
                  navigate("/add-address?redirectTo=cart");
                }}
              >
                ➕ Add New Address
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId}
              >
                Place Order - ₹{(calculateSubtotal() - discount + shipping).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for modal positioning */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-header h3 {
          margin: 0;
          color: #2d3748;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          color: #2d3748;
        }
        
        .modal-body {
          padding: 24px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
          gap: 12px;
        }
        
        .modal-footer .btn {
          flex: 1;
        }
        
        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .address-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .address-option.selected {
          border-color: #d1a054;
          background-color: #fffaf0;
        }
        
        .address-option label {
          display: flex;
          align-items: flex-start;
          flex: 1;
          cursor: pointer;
          margin: 0;
        }
        
        .address-option input[type="radio"] {
          margin-right: 12px;
          margin-top: 4px;
        }
        
        .address-details {
          flex: 1;
        }
        
        .address-details strong {
          display: block;
          margin-bottom: 4px;
          color: #2d3748;
        }
        
        .address-details p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }
        
        .default-badge {
          background: #d1a054;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 8px;
        }
        
        .address-actions {
          display: flex;
          gap: 8px;
          margin-left: 12px;
        }
        
        .btn-edit, .btn-delete {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .btn-edit:hover {
          background: #ebf8ff;
          border-color: #63b3ed;
        }
        
        .btn-delete:hover {
          background: #fed7d7;
          border-color: #fc8181;
        }
        
        .no-addresses {
          text-align: center;
          padding: 40px 20px;
        }
        
        .no-addresses p {
          margin-bottom: 20px;
          color: #718096;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            margin: 20px;
            max-height: 70vh;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .address-option {
            flex-direction: column;
            align-items: stretch;
          }
          
          .address-actions {
            margin-left: 0;
            margin-top: 12px;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
}