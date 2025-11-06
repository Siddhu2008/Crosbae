import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AddAddress.css';
import API_URL from "../api/auth";
// useAuth imported but not needed in this component
import { useLoader } from '../contexts/LoaderContext';

export default function EditAddress({ onSave, onCancel }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get address ID from URL
  const token = localStorage.getItem("access");

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

  const [_loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  // ✅ Load address data when component mounts
  useEffect(() => {
  const fetchAddressAndPhone = async () => {
      try {
        showLoader();
      if (!token) throw new Error("Not authenticated");

      const headers = { 'Authorization': `Bearer ${token}` };

      // 1️⃣ Fetch Address
      const res = await fetch(`${API_URL}/auth/addresses/${id}/`, { headers });
      if (!res.ok) throw new Error("Failed to load address");
      const addressData = await res.json();

      // 2️⃣ Fetch Customer Phone Number (with fail-safe)
      let phoneNumber = "";
      try {
        const phoneRes = await fetch(`${API_URL}/auth/customer-phones/`, { headers });
        if (phoneRes.ok) {
          const phoneData = await phoneRes.json();
          if (Array.isArray(phoneData) && phoneData.length > 0) {
            const primary = phoneData.find(p => p.is_primary) || phoneData[0];
            phoneNumber = primary.phone_number;
          } else if (phoneData.phone_number) {
            phoneNumber = phoneData.phone_number;
          }
        } else {
          console.warn("⚠️ Phone API failed:", phoneRes.status);
        }
      } catch (phoneErr) {
        console.warn("⚠️ Failed to load phone number", phoneErr);
      }

      // 3️⃣ Merge both into form state
      setForm((prev) => ({
        ...prev,
        ...addressData,
        phone_number: phoneNumber || "",
      }));

  setLoading(false);
  hideLoader();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error loading address.");
      setLoading(false);
      hideLoader();
    }
  };

  fetchAddressAndPhone();
}, [id, token]);

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

    try {
      if (!token) throw new Error("User not authenticated");

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const res = await fetch(`${API_URL}/auth/addresses/${id}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(addressPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to update address');
      }

      const updatedAddress = await res.json();

      // Optionally update phone number here...

      onSave?.(updatedAddress);
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

  // global loader handles loading state

  return (
    <section className="add-address-container">
      <h2>Edit Address</h2>
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
            Update Address
          </button>
        </div>
      </form>
    </section>
  );
}
