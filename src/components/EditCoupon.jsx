import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css"; // reuse same form-card styles

export default function EditCoupon() {
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState({
    code: "JEWEL10",
    type: "Percentage", // or Flat
    value: "10", // % or ₹
    expiry: "2025-12-31",
    description: "10% off on all jewelry items",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Coupon updated successfully!");
    console.log("Updated Coupon Data:", coupon);
    navigate("/admin");
  };

  return (
    <div
      className="admin-dashboard"
      style={{
        paddingTop: "120px",
        paddingBottom: "100px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="form-card" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Edit Coupon</h2>

        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={coupon.code}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={coupon.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Percentage">Percentage</option>
          <option value="Flat">Flat</option>
        </select>

        <input
          type="text"
          name="value"
          placeholder={coupon.type === "Flat" ? "Value (₹)" : "Value (%)"}
          value={coupon.value}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="expiry"
          placeholder="Expiry Date"
          value={coupon.expiry}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Coupon Description"
          rows="3"
          value={coupon.description}
          onChange={handleChange}
        />

        <button
          className="save-btn"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Save Changes
        </button>
        <button className="cancel-btn" onClick={() => navigate("/admin")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
