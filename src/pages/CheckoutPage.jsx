import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";
import Seo from "../components/Seo";

export function CheckoutPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Prefill from selectedAddress saved in localStorage by CartPage
  React.useEffect(() => {
    try {
      const sel = JSON.parse(localStorage.getItem("selectedAddress"));
      if (sel) {
        setForm((f) => ({
          ...f,
          fullName: sel.fullName || f.fullName,
          address: sel.addressLine || f.address,
          city: sel.city || f.city,
          postalCode: sel.postalCode || f.postalCode,
          country: sel.country || f.country,
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Load saved addresses and manage add-address UI
  const [addresses, setAddresses] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [addAddressForm, setAddAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("addresses")) || [];
      setAddresses(stored);
    } catch (e) {
      setAddresses([]);
    }
  }, []);

  const useSavedAddress = (addr) => {
    setForm((f) => ({
      ...f,
      fullName: addr.fullName || f.fullName,
      address: addr.addressLine || f.address,
      city: addr.city || f.city,
      postalCode: addr.postalCode || f.postalCode,
      country: addr.country || f.country,
    }));
    localStorage.setItem("selectedAddress", JSON.stringify(addr));
  };

  const handleAddAddressChange = (e) => {
    const { name, value } = e.target;
    setAddAddressForm((s) => ({ ...s, [name]: value }));
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    const id = Date.now();
    const addr = { ...addAddressForm, id };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setShowAddNew(false);
    setAddAddressForm({ fullName: "", phone: "", addressLine: "", city: "", postalCode: "", country: "" });
    useSavedAddress(addr);
  };

  const deleteAddress = (id) => {
    const filtered = addresses.filter((a) => a.id !== id);
    setAddresses(filtered);
    localStorage.setItem("addresses", JSON.stringify(filtered));
    const sel = JSON.parse(localStorage.getItem("selectedAddress"));
    if (sel && sel.id === id) localStorage.removeItem("selectedAddress");
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal Code is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!form.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    if (!form.cvv.trim()) newErrors.cvv = "CVV is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate successful checkout
      alert("Thank you for your purchase!");
      localStorage.removeItem("selectedAddress");
      navigate("/"); // Redirect to home or order confirmation page
    }
  };

  return (
    <div className="checkout-container container my-5">
      <Seo title="Checkout" noIndex />
      <h2 className="checkout-title text-center mb-4">Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        {/* Address chooser */}
        <div className="checkout-address-chooser mb-3">
          <h5>Choose Shipping Address</h5>
          {addresses.length === 0 ? (
            <div className="no-address">No saved addresses. Please add one below.</div>
          ) : (
            <div className="address-chooser-grid">
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card p-2">
                  <div>
                    <strong>{addr.fullName}</strong>
                    <div>{addr.addressLine}, {addr.city}, {addr.postalCode}, {addr.country}</div>
                    <div>Phone: {addr.phone}</div>
                  </div>
                  <div className="address-actions mt-2">
                    <button type="button" className="btn btn-outline-primary me-2" onClick={() => useSavedAddress(addr)}>Use this</button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => deleteAddress(addr.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <button type="button" className="btn btn-link" onClick={() => setShowAddNew((s) => !s)}>{showAddNew ? 'Cancel' : 'Add new address'}</button>
          </div>

          {showAddNew && (
            <form className="add-address-form mt-2" onSubmit={addNewAddress}>
              <div className="form-row">
                <input name="fullName" placeholder="Full name" value={addAddressForm.fullName} onChange={handleAddAddressChange} required />
                <input name="phone" placeholder="Phone" value={addAddressForm.phone} onChange={handleAddAddressChange} required />
              </div>
              <div className="form-row mt-2">
                <input name="addressLine" placeholder="Address line" value={addAddressForm.addressLine} onChange={handleAddAddressChange} required />
              </div>
              <div className="form-row mt-2">
                <input name="city" placeholder="City" value={addAddressForm.city} onChange={handleAddAddressChange} required />
                <input name="postalCode" placeholder="Postal code" value={addAddressForm.postalCode} onChange={handleAddAddressChange} required />
              </div>
              <div className="form-row mt-2">
                <input name="country" placeholder="Country" value={addAddressForm.country} onChange={handleAddAddressChange} required />
              </div>
              <div className="form-actions mt-2">
                <button type="submit" className="btn btn-outline-primary">Save address</button>
              </div>
            </form>
          )}
        </div>

        <fieldset>
          <legend>Shipping Details</legend>
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.fullName && <small className="error">{errors.fullName}</small>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street"
            />
            {errors.address && <small className="error">{errors.address}</small>}
          </label>

          <div className="form-row">
            <label>
              City
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="New York"
              />
              {errors.city && <small className="error">{errors.city}</small>}
            </label>

            <label>
              Postal Code
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="10001"
              />
              {errors.postalCode && <small className="error">{errors.postalCode}</small>}
            </label>
          </div>

          <label>
            Country
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="USA"
            />
            {errors.country && <small className="error">{errors.country}</small>}
          </label>
        </fieldset>

        <fieldset>
          <legend>Payment Information</legend>
          <label>
            Card Number
            <input
              type="text"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && <small className="error">{errors.cardNumber}</small>}
          </label>

          <div className="form-row">
            <label>
              Expiry Date
              <input
                type="text"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && <small className="error">{errors.expiryDate}</small>}
            </label>

            <label>
              CVV
              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <small className="error">{errors.cvv}</small>}
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-checkout">Place Order</button>

        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={() => {
            // allow user to change address: clear selected and go back to cart where modal will open
            localStorage.removeItem("selectedAddress");
            navigate("/cart");
          }}
        >
          Change Address
        </button>

        <Link to="/cart" className="btn-back">
          ← Back to Cart
        </Link>
      </form>
    </div>
  );
}
