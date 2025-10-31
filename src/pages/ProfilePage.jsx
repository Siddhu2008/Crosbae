import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile, getUserAddresses } from "../api/user";
import "../styles/ProfilePage.css";
import API_URL from "../api/auth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // ✅ Fetch user profile
        const userData = await getUserProfile(token);
        setUser(userData);

        // ✅ Fetch addresses
        let addressData = [];
        try {
          const rawAddressData = await getUserAddresses(token);

          // Normalize different possible formats
          if (Array.isArray(rawAddressData)) {
            addressData = rawAddressData;
          } else if (
            rawAddressData &&
            typeof rawAddressData === "object" &&
            "results" in rawAddressData &&
            Array.isArray(rawAddressData.results)
          ) {
            addressData = rawAddressData.results;
          } else {
            const arrProp = Object.values(rawAddressData).find(Array.isArray);
            addressData = arrProp || [];
          }
        } catch (e) {
          console.warn("Failed to fetch addresses:", e);
        }

        // ✅ Filter only addresses belonging to the logged-in user
        const filteredAddresses = Array.isArray(addressData)
          ? addressData.filter(
              (addr) =>
                addr.customer === userData.id ||
                addr.user === userData.id || // in case API uses user instead of customer
                addr.customer_id === userData.id
            )
          : [];

        setAddresses(filteredAddresses);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, location.key]);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${API_URL}/auth/addresses/${addressId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      } else {
        alert("Failed to delete address.");
      }
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
