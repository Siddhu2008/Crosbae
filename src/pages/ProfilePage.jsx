import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api/auth"; // Your base API URL
import { AuthContext } from "../contexts/AuthContext";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchWithAuth } = useContext(AuthContext);

  const [customerInfo, setCustomerInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");
  const loggedInEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch customer data
        const customerRes = await fetchWithAuth(`${API_URL}/api/auth/customers/`);
        if (!customerRes.ok) throw new Error("Failed to fetch customer info");
        const customersData = await customerRes.json();
        console.log("Customer API response:", customersData);

        let currentCustomer = null;
        if (
          typeof customersData === "object" &&
          customersData !== null &&
          "results" in customersData &&
          Array.isArray(customersData.results)
        ) {
          currentCustomer = customersData.results.find(
            (cust) => cust.user && cust.user.email === loggedInEmail
          );
        }
        if (!currentCustomer && Array.isArray(customersData)) {
          currentCustomer = customersData.find(
            (cust) => cust.user && cust.user.email === loggedInEmail
          );
        }
        if (!currentCustomer) {
          throw new Error(`Logged in customer with email ${loggedInEmail} not found`);
        }
        setCustomerInfo(currentCustomer.user ? currentCustomer.user : currentCustomer);

        // Fetch addresses
        let addressData = [];
        try {
          const addressRes = await fetchWithAuth(`${API_URL}/api/auth/addresses/`);
          if (addressRes.ok) {
            const rawAddressData = await addressRes.json();
            if (Array.isArray(rawAddressData)) {
              addressData = rawAddressData;
            } else if (
              typeof rawAddressData === "object" &&
              rawAddressData !== null &&
              "results" in rawAddressData &&
              Array.isArray(rawAddressData.results)
            ) {
              addressData = rawAddressData.results;
            } else {
              const arrProp = Object.values(rawAddressData).find(Array.isArray);
              addressData = arrProp || [];
            }
            console.log("Processed addresses data:", addressData);
          }
        } catch (e) {
          // Ignore address fetch errors
        }

        setAddresses(Array.isArray(addressData) ? addressData : []);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, loggedInEmail, location.key]);

  // ✅ Delete address handler (must be outside return!)
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/auth/addresses/${addressId}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      } else {
        alert("Failed to delete address.");
      }
    } catch (err) {
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
            src="https://i.pravatar.cc/160?img=47"
            alt="User Avatar"
            className="avatar-img"
          />
        </div>

        {/* User Info */}
        <h2 className="profile-name">{customerInfo?.name ?? "Unnamed User"}</h2>
        <p className="profile-email">{customerInfo?.email ?? "No email available"}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div>
            <strong>Age:</strong> {customerInfo?.age ?? "N/A"}
          </div>
          <div>
            <strong>Member Since:</strong> {customerInfo?.member_since ?? "N/A"}
          </div>
          <div>
            <strong>Loyalty Tier:</strong> {customerInfo?.loyalty_tier ?? "N/A"}
          </div>
          <div>
            <strong>Total Orders:</strong> {customerInfo?.total_orders ?? 0}
          </div>
          <div>
            <strong>Total Spent:</strong> ₹
            {customerInfo?.total_spent
              ? customerInfo.total_spent.toLocaleString()
              : "0"}
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
              {addresses.map((addr, index) => (
                <div key={index} className="address-summary">
                  <strong>{addr.title || "No Label"}</strong> —{" "}
                  {addr.address_line1 || ""}
                  {addr.address_line2 ? ", " + addr.address_line2 : ""}, {addr.city || ""}, {addr.state || ""} {addr.pincode ? "- " + addr.pincode : ""}, {addr.country || "India"}
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
