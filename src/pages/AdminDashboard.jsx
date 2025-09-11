import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Seo from "../components/Seo";

const tabs = [
  "Overview",
  "Products",
  "Categories",
  "Orders",
  "Customers",
  "Coupons",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");

  // static data
  const products = [
    {
      name: "Gold Necklace",
      category: "Necklace",
      price: "25000",
      stock: 15,
      quantity: 5,
    },
    {
      name: "Silver Ring",
      category: "Ring",
      price: "12000",
      stock: 30,
      quantity: 10,
    },
    {
      name: "Diamond Earrings",
      category: "Earrings",
      price: "50000",
      stock: 10,
      quantity: 3,
    },
  ];
  const categories = ["Necklace", "Ring", "Earrings", "Bracelet"];
  const orders = ["#ORD1234", "#ORD1235", "#ORD1236"];
  const customers = ["Anjali Mehta", "Rohan Jain", "Sonia Kapoor"];
  const coupons = [
    {
      code: "JEWEL10",
      type: "Percentage",
      value: "10%",
      expiry: "31 Dec 2025",
    },
    { code: "GOLD500", type: "Flat", value: "₹500", expiry: "31 Dec 2025" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <>
            <div className="stats-section">
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

      case "Products": {
        const filteredProducts = products.filter((item) =>
          item.name.toLowerCase().includes(productSearch.toLowerCase())
        );
        return (
          <div className="products-tab">
            <div className="tab-header">
              <h2>All Products</h2>
              <input
                type="text"
                placeholder="Search Products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="admin-search-bar"
              />
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
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src="https://tse1.mm.bing.net/th/id/OIP.bT6r6Wdmg6HAnSXKNUXfTQHaE8?pid=Api&P=0&w=300&h=300"
                          alt={item.name}
                          width="60"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>₹{item.price}</td>
                      <td>{item.stock}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Link to="/admin/edit-product">
                          <button className="edit-btn">Edit</button>
                        </Link>
                        <Link to="/admin/delete-product">
                          <button className="delete-btn">Delete</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case "Categories": {
        const filteredCategories = categories.filter((cat) =>
          cat.toLowerCase().includes(categorySearch.toLowerCase())
        );
        return (
          <div className="categories-tab">
            <div className="tab-header">
              <h2>All Categories</h2>
              <input
                type="text"
                placeholder="Search Categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="admin-search-bar"
              />
              <Link to="/admin/add-category">
                <button className="add-product-btn my-4">+ Add Category</button>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, idx) => (
                    <tr key={idx}>
                      <td>{cat}</td>
                      <td>{cat} jewelry collection</td>
                      <td>
                        <Link to="/admin/edit-category">
                          <button className="edit-btn">Edit</button>
                        </Link>
                        <Link to="/admin/delete-category">
                          <button className="delete-btn">Delete</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case "Orders": {
        const filteredOrders = orders.filter((ord) =>
          ord.toLowerCase().includes(orderSearch.toLowerCase())
        );
        return (
          <div className="orders-tab">
            <h2>Recent Orders</h2>
            <input
              type="text"
              placeholder="Search Orders..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="admin-search-bar"
            />
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
                  {filteredOrders.map((ord, idx) => (
                    <tr key={idx}>
                      <td>{ord}</td>
                      <td>Priya Sharma</td>
                      <td>22 Jul 2025</td>
                      <td>
                        <span className="badge completed">Completed</span>
                      </td>
                      <td>₹12,000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case "Customers": {
        const filteredCustomers = customers.filter((cust) =>
          cust.toLowerCase().includes(customerSearch.toLowerCase())
        );
        return (
          <div className="customers-tab">
            <h2>All Customers</h2>
            <input
              type="text"
              placeholder="Search Customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="admin-search-bar"
            />
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
                  {filteredCustomers.map((cust, idx) => (
                    <tr key={idx}>
                      <td>{cust}</td>
                      <td>{cust.split(" ")[0].toLowerCase()}@gmail.com</td>
                      <td>15 Apr 2025</td>
                      <td>6</td>
                      <td>₹48,000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case "Coupons": {
        const filteredCoupons = coupons.filter((c) =>
          c.code.toLowerCase().includes(couponSearch.toLowerCase())
        );
        return (
          <div className="coupons-tab">
            <div className="tab-header">
              <h2>Manage Coupons</h2>
              <input
                type="text"
                placeholder="Search Coupons..."
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
                className="admin-search-bar"
              />
              <Link to="/admin/add-coupon">
                <button className="add-product-btn my-4">+ Add Coupon</button>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((c, idx) => (
                    <tr key={idx}>
                      <td>{c.code}</td>
                      <td>{c.type}</td>
                      <td>{c.value}</td>
                      <td>{c.expiry}</td>
                      <td>
                        <Link to="/admin/edit-coupon">
                          <button className="edit-btn">Edit</button>
                        </Link>
                        <Link to="/admin/delete-coupon">
                          <button className="delete-btn">Delete</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="admin-dashboard text-center"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
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
