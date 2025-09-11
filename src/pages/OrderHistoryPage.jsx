// src/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OrderHistory.css";

const dummyOrders = [
  {
    id: "ORD123",
    date: "2025-08-20",
    total: 3099,
    status: "Delivered",
    items: [
      {
        name: "Elegant Gold Necklace",
        price: 2499,
        qty: 1,
        image:
          "https://i.pinimg.com/736x/11/82/fa/1182fa5e7e9827d208ec3344fbae7ab5.jpg",
      },
      {
        name: "Diamond Earrings",
        price: 600,
        qty: 1,
        image: "https://d2ma7w4w9grdob.cloudfront.net/media/45100-IND_2930.JPG",
      },
    ],
  },
  {
    id: "ORD124",
    date: "2025-09-05",
    total: 2799,
    status: "inprogress", // 👈 not delivered yet
    items: [
      {
        name: "Platinum Bracelet",
        price: 2799,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1616627891960-9d26b9d54b19?auto=format&fit=crop&w=500&q=60",
      },
    ],
  },
  {
    id: "ORD122",
    date: "2025-07-15",
    total: 1899,
    status: "Cancelled",
    items: [
      {
        name: "Rose Gold Ring",
        price: 1899,
        qty: 1,
        image:
          "https://www.orra.co.in/media/catalog/product/o/r/org22019_1_m2xicjnhbgtdbr3r.jpg",
      },
    ],
  },
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(dummyOrders);
  }, []);

  return (
    <div className="order-history">
      <div className="oh-header">
        <h1 className="oh-title">My Orders</h1>
        <p className="oh-subtitle">
          Track your purchases and revisit your favourite pieces.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="oh-empty">
          <div className="oh-empty-icon" aria-hidden="true">
            💎
          </div>
          <p className="oh-empty-text">You haven’t placed any orders yet.</p>
          <button className="oh-cta">Start Shopping</button>
        </div>
      ) : (
        <div className="oh-list">
          {orders.map((order) => (
            <article
              key={order.id}
              className="oh-card"
              aria-label={`Order ${order.id}`}
            >
              {/* Card Head */}
              <header className="oh-card-head">
                <div className="oh-id">
                  <span className="oh-label">Order ID</span>
                  <span className="oh-value mono">{order.id}</span>
                </div>
                <div className="oh-date">
                  <span className="oh-label">Date</span>
                  <time className="oh-value">{order.date}</time>
                </div>
                <div className="oh-status">
                  <span className="oh-label">Status</span>
                  <span className={`oh-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="oh-total">
                  <span className="oh-label">Total</span>
                  <span className="oh-value">₹{order.total}</span>
                </div>
              </header>

              {/* Progress / Timeline feel */}
              <div className="oh-progress" aria-hidden="true">
                <div
                  className={`oh-progress-bar ${
                    order.status === "Delivered"
                      ? "delivered"
                      : order.status === "Cancelled"
                      ? "cancelled"
                      : "inprogress"
                  }`}
                />
                <div className="oh-progress-steps">
                  <span>Placed</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Items */}
              <div className="oh-items">
                {order.items.map((item, index) => (
                  <div key={index} className="oh-item">
                    <img
                      className="oh-thumb"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="oh-item-info">
                      <p className="oh-item-name">{item.name}</p>
                      <div className="oh-item-meta">
                        <span>Qty: {item.qty}</span>
                        <span className="dot" aria-hidden="true">
                          •
                        </span>
                        <span>₹{item.price}</span>
                      </div>
                    </div>
                    <div className="oh-item-actions">
                      <button className="oh-link">Buy Again</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Foot */}
              <footer className="oh-card-foot">
                <Link
                  to={`/orders/${order.id}`}
                  className="oh-btn outline  text-decoration-none"
                >
                  View Details
                </Link>

                <button className="oh-btn">Download Invoice</button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
