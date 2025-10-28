import React, { useState } from "react";
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
      navigate("/"); // Redirect to home or order confirmation page
    }
  };

  return (
    <div className="checkout-container container my-5">
      <Seo title="Checkout" noIndex />
      <h2 className="checkout-title text-center mb-4">Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
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

        <Link to="/place-order" type="submit" className="btn btn-checkout">
          Place Order
        </Link>

        <Link to="/cart" className="btn-back">
          ← Back to Cart
        </Link>
      </form>
    </div>
  );
}