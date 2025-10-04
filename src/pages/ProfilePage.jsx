import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Simulated user data from sign-up
  const user = {
    name: "Ananya Kapoor",
    age: 29,
    email: "ananya.kapoor@example.com",
    memberSince: "March 2023",
    loyaltyTier: "Gold Member",
    totalOrders: 12,
    totalSpent: 185000,
  };

  return (
    <div className="profile-container my-5">
      <div className="profile-card my-3">
        {/* Profile Picture */}
        <div className="profile-avatar">
          <img
            src="https://i.pravatar.cc/160?img=47"
            alt="User Avatar"
            className="avatar-img"
          />
        </div>

        {/* User Info */}
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>

        {/* Extra Details */}
        <div className="profile-stats">
          <div><strong>Age:</strong> {user.age}</div>
          <div><strong>Member Since:</strong> {user.memberSince}</div>
          <div><strong>Loyalty Tier:</strong> {user.loyaltyTier}</div>
          <div><strong>Total Orders:</strong> {user.totalOrders}</div>
          <div><strong>Total Spent:</strong> ₹{user.totalSpent.toLocaleString()}</div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            onClick={() => navigate("/edit-profile")}
            className="profile-btn edit"
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="profile-btn primary"
          >
            🧾 Order History
          </button>
          <button
            onClick={() => navigate("/track-order")}
            className="profile-btn secondary"
          >
            🚚 Track My Order
          </button>
        </div>
      </div>
    </div>
  );
}
