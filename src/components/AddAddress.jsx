import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddAddress.css';
import API_URL from "../api/auth";
// Auth context available if needed via useAuth() — not used in this component

export default function AddAddress({ onSave, onCancel }) {
  const navigate = useNavigate();
  // Auth context available if needed via useAuth()

  const token = localStorage.getItem("access"); // or pass it through AuthContext

  const [form, setForm] = useState({
    title: '',
    address_line1: '',
    address_line2: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
    phone_number: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressPayload = {
      title: form.title,
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      street: form.street,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      is_default: form.is_default,
    };

    const phonePayload = {
      phone: form.phone_number, // ✅ match backend field name
      is_primary: true,
    };

    try {
      if (!token) throw new Error('User not authenticated');

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // ➤ Create address
      const addressRes = await fetch(`${API_URL}/auth/addresses/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(addressPayload),
      });

      if (!addressRes.ok) {
        const errorData = await addressRes.json();
        throw new Error(errorData.detail || 'Failed to save address');
      }

      const addressData = await addressRes.json();

      // ➤ Create phone if entered
      if (form.phone_number.trim()) {
        const phoneRes = await fetch(`${API_URL}/auth/customer-phones/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(phonePayload),
        });

        if (!phoneRes.ok) {
          const phoneError = await phoneRes.json();
          throw new Error(phoneError.phone?.[0] || 'Failed to save phone number');
        }
      }

      onSave?.(addressData);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <section className="add-address-container">
      <h2>Add New Address</h2>
      <form className="add-address-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Address Title (e.g., Home, Office)"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address_line1"
          placeholder="Address Line 1"
          value={form.address_line1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address_line2"
          placeholder="Address Line 2 (Optional)"
          value={form.address_line2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          maxLength="6"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number (Optional)"
          value={form.phone_number}
          maxLength="10"
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          Set as default address
        </label>

        <div className="address-buttons">
          <button type="button" onClick={handleCancel} className="btn cancel">
            Cancel
          </button>
          <button type="submit" className="btn primary">
            Save Address
          </button>
        </div>
      </form>
    </section>
  );
}
