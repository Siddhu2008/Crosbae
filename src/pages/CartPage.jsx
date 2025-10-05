import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CartPage.css"; // Make sure to update your CSS accordingly
import Seo from "../components/Seo";

// Using a lightweight inline modal (no external dependency)

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    id: null,
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);

    const storedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(storedAddresses);
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

  // Address handling
  const openAddressModal = () => setShowAddressModal(true);
  const closeAddressModal = () => setShowAddressModal(false);

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = (e) => {
    e.preventDefault();
    const id = Date.now();
    const addr = { ...newAddress, id };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));

    // clear new address form
    setNewAddress({ id: null, fullName: "", phone: "", addressLine: "", city: "", postalCode: "", country: "" });
  };

  const selectAddressAndCheckout = (address) => {
    // Save selected address into localStorage so checkout page can read it
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    closeAddressModal();
    navigate("/checkout");
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
                      ₹{item.price} {item.oldPrice && <span className="cart-oldprice">₹{item.oldPrice}</span>}
                    </p>
                  </div>
                </div>

                {/* RIGHT: Qty + Delete */}
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

          {/* Sidebar with Coupon + Order Summary */}
          <div className="cart-sidebar">
            {/* Coupon Box */}
            <div className="coupon-box">
              <div className="coupon-header">
                <span role="img" aria-label="gift">🎁</span> Have a coupon?
              </div>
              <div className="coupon-input-group">
                <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {couponError && <p className="coupon-error">{couponError}</p>}
              {discount > 0 && !couponError && (<p className="coupon-success">Coupon applied! You saved ₹{discount.toFixed(2)}.</p>)}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line"><span>Subtotal</span><span>₹{calculateSubtotal().toFixed(2)}</span></div>
              <div className="summary-line discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
              <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <hr />
              <div className="summary-line total"><span>Total</span><span>₹{(calculateSubtotal() - discount + shipping).toFixed(2)}</span></div>

              <button className="btn checkout-btn" onClick={openAddressModal}>Proceed to Checkout</button>
              <Link to="/shop" className="continue-btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}

      {/* Address selection modal (inline implementation) */}
      {showAddressModal && (
        <div className="address-modal-overlay" onClick={closeAddressModal}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5>Select Shipping Address</h5>
              <button className="btn-close" onClick={closeAddressModal}></button>
            </div>

            <div className="modal-body">
              {addresses.length === 0 ? (
                <div className="no-address">
                  <p>No saved addresses found. Please add one.</p>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="address-card">
                      <div>
                        <strong>{addr.fullName}</strong>
                        <div>{addr.addressLine}, {addr.city}, {addr.postalCode}, {addr.country}</div>
                        <div>Phone: {addr.phone}</div>
                      </div>
                      <div>
                        <button className="btn btn-primary" onClick={() => selectAddressAndCheckout(addr)}>Ship to this address</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr />

              <h6>Add New Address</h6>
              <form onSubmit={saveNewAddress} className="new-address-form">
                <div className="form-row">
                  <input name="fullName" placeholder="Full name" value={newAddress.fullName} onChange={handleNewAddressChange} required />
                  <input name="phone" placeholder="Phone" value={newAddress.phone} onChange={handleNewAddressChange} required />
                </div>
                <div className="form-row">
                  <input name="addressLine" placeholder="Address line" value={newAddress.addressLine} onChange={handleNewAddressChange} required />
                </div>
                <div className="form-row">
                  <input name="city" placeholder="City" value={newAddress.city} onChange={handleNewAddressChange} required />
                  <input name="postalCode" placeholder="Postal code" value={newAddress.postalCode} onChange={handleNewAddressChange} required />
                </div>
                <div className="form-row">
                  <input name="country" placeholder="Country" value={newAddress.country} onChange={handleNewAddressChange} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-outline-primary">Save Address</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
