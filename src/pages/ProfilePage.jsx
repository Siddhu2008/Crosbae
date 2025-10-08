import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/auth"; // Your base API URL
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming email is saved in localStorage at login
  const token = localStorage.getItem("access");
  const loggedInEmail = localStorage.getItem("userEmail"); // Adjust according to your auth flow

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch customers data
        const customerRes = await fetch(`${API_URL}/api/auth/customers/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!customerRes.ok) {
          throw new Error("Failed to fetch customer info");
        }

        const customersData = await customerRes.json();

        console.log("Customer API response:", customersData); // Debug to see response

        let currentCustomer = null;

        if (
          typeof customersData === "object" &&
          customersData !== null &&
          "results" in customersData &&
          Array.isArray(customersData.results)
        ) {
          // The customer list is inside results
          currentCustomer = customersData.results.find(
            (cust) => cust.email === loggedInEmail
          );
        } else if (Array.isArray(customersData)) {
          // If the response is just an array
          currentCustomer = customersData.find(
            (cust) => cust.email === loggedInEmail
          );
        } else {
          // If it's a single customer object
          currentCustomer = customersData;
        }

        if (!currentCustomer) {
          throw new Error(`Logged in customer with email ${loggedInEmail} not found`);
        }

        setCustomerInfo(currentCustomer);

        // Fetch addresses (assuming addresses endpoint returns addresses for logged in customer)
        const addressRes = await fetch(`${API_URL}/api/auth/addresses/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!addressRes.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const addressData = await addressRes.json();

        setAddresses(Array.isArray(addressData) ? addressData : []);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, loggedInEmail]);

  const formatFullAddress = (addr) => (
    <>
      <p>
        <strong>{addr.name || customerInfo?.name || "No Name"}</strong> | 📞{" "}
        {addr.phone || "No Phone"}
      </p>
      <p>{addr.address_line1 || ""}</p>
      {addr.address_line2 && <p>{addr.address_line2}</p>}
      <p>
        {addr.city || ""}, {addr.state || ""} - {addr.pincode || ""}
      </p>
      <p>{addr.country || "India"}</p>
    </>
  );

  const formatSummaryAddress = (addr) => (
    <p>
      <strong>{addr.name || customerInfo?.name || "No Name"}</strong> —{" "}
      {addr.city || ""}, {addr.state || ""}
    </p>
  );

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
        <h2 className="profile-name">{customerInfo?.name || "User"}</h2>
        <p className="profile-email">{customerInfo?.email || "Email not available"}</p>

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
            <strong>Total Orders:</strong> {customerInfo?.total_orders ?? "N/A"}
          </div>
          <div>
            <strong>Total Spent:</strong>{" "}
            ₹
            {customerInfo?.total_spent
              ? customerInfo.total_spent.toLocaleString()
              : "N/A"}
          </div>
        </div>

        {/* Address Section */}
        <div className="address-section">
          <h3>📍 Shipping Address</h3>

          {addresses.length === 0 && (
            <div>
              <p>No address on file.</p>
              <button
                className="profile-btn edit"
                onClick={() => navigate("/add-address")}
              >
                ➕ Add Address
              </button>
            </div>
          )}

          {addresses.length === 1 && (
            <div className="address-box">
              {formatFullAddress(addresses[0])}
              <div className="address-buttons">
                <button
                  className="profile-btn edit"
                  onClick={() => navigate("/add-address")}
                >
                  ✏️ Edit Address
                </button>
                <button
                  className="profile-btn secondary"
                  onClick={() => navigate("/add-address")}
                >
                  ➕ Add New Address
                </button>
              </div>
            </div>
          )}

          {addresses.length > 1 && (
            <div className="multiple-address-box">
              {addresses.map((addr, index) => (
                <div key={index} className="address-summary">
                  {formatSummaryAddress(addr)}
                  <button
                    className="profile-btn small"
                    onClick={() => navigate("/add-address")}
                  >
                    ✏️ Edit
                  </button>
                </div>
              ))}
              <button
                className="profile-btn secondary mt-2"
                onClick={() => navigate("/add-address")}
              >
                ➕ Add New Address
              </button>
            </div>
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
