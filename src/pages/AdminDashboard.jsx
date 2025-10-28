import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Seo from "../components/Seo";

const tabs = ["Overview", "Products", "Orders", "Customers"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <>
            <div className="stats-section" >
              <div className="stat-card">
                <h4>Total Products</h4>
                <p className="count">156</p>
                <span className="growth">+12 from last month</span>
              </div>
              <div className="stat-card">
                <h4>Total Orders</h4>
                <p className="count">1247</p>
                <span className="growth green">+18% from last month</span>
              </div>
              <div className="stat-card">
                <h4>Total Customers</h4>
                <p className="count">892</p>
                <span className="growth green">+8% from last month</span>
              </div>
              <div className="stat-card">
                <h4>Monthly Revenue</h4>
                <p className="count">₹156,750</p>
                <span className="growth green">+24% from last month</span>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions">
                <button className="action-btn">Manage Inventory</button>
                <button className="action-btn">Export Reports</button>
                <button className="action-btn">Customer Support</button>
              </div>
            </div>
          </>
        );

      case "Products":
        return (
          <div className="products-tab">
            <div className="tab-header">
              <h2>All Products</h2>
              <Link to="/admin/add-product">
                <button className="add-product-btn my-4">+ Add Product</button>
              </Link>
            </div>
              <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Map over your product data */}
                <tr>
                  <td>
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.bT6r6Wdmg6HAnSXKNUXfTQHaE8?pid=Api&P=0&w=300&h=300"
                      alt="Product"
                      width="100px"
                    />
                  </td>
                  <td>Gold Necklace</td>
                  <td>Necklace</td>
                  <td>₹25,000</td>
                  <td>15</td>
                  <td>
                    <Link to="/admin/EditProduct">
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <Link to="/admin/DeleteProduct">
                      <button className="delete-btn">Delete</button>
                    </Link>
                  </td>
                </tr>
                {/* Repeat for more products */}
              </tbody>
            </table>
            </div>
          </div>
        );

      case "Orders":
        return (
          <div className="orders-tab">
            <h2>Recent Orders</h2>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD1234</td>
                  <td>Priya Sharma</td>
                  <td>22 Jul 2025</td>
                  <td>
                    <span className="badge completed">Completed</span>
                  </td>
                  <td>₹12,000</td>
                </tr>
                {/* More rows */}
              </tbody>
            </table>
            </div>
          </div>
        );

      case "Customers":
        return (
          <div className="customers-tab">
            <h2>All Customers</h2>
            <div class="table-wrapper">
              <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Total Orders</th>
                    <th>Spent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Anjali Mehta</td>
                    <td>anjali@gmail.com</td>
                    <td>15 Apr 2025</td>
                    <td>6</td>
                    <td>₹48,000</td>
                  </tr>
                  {/* More rows */}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard text-center" style={{paddingTop:"120px",paddingBottom:"100px"}}>
      <Seo title="Admin Dashboard" noIndex />
      <div className="header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your jewelry store efficiently</p>
        </div>
        
      </div>

      <div className="tabs my-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
