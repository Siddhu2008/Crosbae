import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import { useAuth } from "../contexts/AuthContext";
import { useAddresses } from "../contexts/AddressContext";

export default function ProfilePage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addresses, loading: addrLoading, error: addrError, fetchAddresses, deleteAddress } = useAddresses();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    // ensure addresses fresh
    fetchAddresses().finally(() => setLoading(false));
  }, [user]);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(addressId);
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Error deleting address.");
    }
  };

  if (loading) {
    return (
      <div className="profile-container my-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container my-5">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container my-5">
      <div className="profile-card my-3">
        {/* Profile Picture */}
        <div className="profile-avatar">
       
        <img
          src={
            user?.image_url
              ? user.image_url.startsWith("http")
                ? user.image_url
                : "https://cdn.crosbae.com/" + user.image_url
              : "https://i.pravatar.cc/160?img=47"
          }
          alt="User Avatar"
          className="avatar-img"
        />
        </div>

        {/* User Info */}
        <h2 className="profile-name">
          {(user?.first_name || "") + " " + (user?.last_name || "")}
        </h2>
        <p className="profile-email">{user?.email || "No email available"}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div>
            <strong>Username:</strong> {user?.username || "N/A"}
          </div>
          <div>
            <strong>Gender:</strong> {user?.gender || "N/A"}
          </div>
          <div>
            <strong>Date of Birth:</strong> {user?.dob || "N/A"}
          </div>
        </div>

        {/* Address Section */}
        <div className="address-section">
          <h3>📍 Shipping Address</h3>
          {addresses.length === 0 ? (
            <div>
              <p>No address on file.</p>
              <button
                className="profile-btn edit"
                onClick={() => navigate("/add-address")}
              >
                ➕ Add Address
              </button>
            </div>
          ) : (
            <>
              {addresses.map((addr) => (
                <div key={addr.id} className="address-summary">
                  <strong>{addr.title || "No Label"}</strong> —{" "}
                  {addr.address_line1 || ""}
                  {addr.address_line2 ? ", " + addr.address_line2 : ""},{" "}
                  {addr.city || ""}, {addr.state || ""}{" "}
                  {addr.pincode ? "- " + addr.pincode : ""},{" "}
                  {addr.country || "India"}
                  <div className="address-actions">
                    <button
                      className="profile-btn small"
                      onClick={() => navigate(`/edit-address/${addr.id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="profile-btn small delete"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="profile-btn secondary mt-2"
                onClick={() => navigate("/add-address")}
              >
                ➕ Add New Address
              </button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            onClick={() => navigate("/edit-profile")}
            className="profile-btn secondary"
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="profile-btn primary"
          >
            🧾 Order History
          </button>
          
        </div>
      </div>
    </div>
  );
}
