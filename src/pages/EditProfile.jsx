import React, { useState } from "react";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    age: "28",
    email: "johndoe@example.com",
    phone: "9876543210",
    gender: "Male",
    address: "123 Gold Street, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="edit-profile-container my-5">
      <h2 className="edit-profile-title my-3">Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <label>
          City
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>

        <label>
          State
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </label>

        <label>
          Pincode
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="save-btn">
          💎 Save Changes
        </button>
      </form>
    </div>
  );
}
