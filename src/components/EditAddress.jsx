import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AddAddress.css';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import { useAddresses } from '../contexts/AddressContext';

export default function EditAddress({ onSave, onCancel }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get address ID from URL
  const { user } = useAuth();
  const token = localStorage.getItem("access");
  const { updateAddress } = useAddresses();

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

  const [loading, setLoading] = useState(true);

  // ✅ Load address data when component mounts
  useEffect(() => {
    const fetchAddressAndPhone = async () => {
      try {
        if (!token) throw new Error("Not authenticated");

        const res = await api.get(`/auth/addresses/${id}/`);
        const addressData = res.data;

        let phoneNumber = "";
        try {
          const phoneRes = await api.get('/auth/customer-phones/');
          const phoneData = phoneRes.data;
          if (Array.isArray(phoneData) && phoneData.length > 0) {
            const primary = phoneData.find((p) => p.is_primary) || phoneData[0];
            phoneNumber = primary.phone || primary.phone_number || "";
          } else if (phoneData && phoneData.phone_number) {
            phoneNumber = phoneData.phone_number;
          }
        } catch (phoneErr) {
          console.warn("⚠️ Failed to load phone number", phoneErr);
        }

        setForm((prev) => ({ ...prev, ...addressData, phone_number: phoneNumber || "" }));
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert(err.message || "Error loading address.");
        setLoading(false);
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

      const updatedAddress = await updateAddress(id, addressPayload);
      // Optionally update phone number here using api.post/patch

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

  if (loading) {
    return <div className="add-address-container">Loading address...</div>;
  }

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
