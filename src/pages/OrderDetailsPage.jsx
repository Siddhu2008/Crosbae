// src/pages/OrderDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/OrderDetails.css";
import API_URL from "../api/auth";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (loading) return <div className="order-details container"><p>Loading order...</p></div>;
  if (!order) return <div className="order-details container"><p>Order not found.</p></div>;

  return (
    <div className="order-details container">
      <header className="od-header">
        <Link to="/orders" className="od-back">← Back to Orders</Link>
        <h1 className="od-title">Order {order.uuid}</h1>
        <div className="od-meta">
          <span><strong>Date:</strong> {new Date(order.order_on).toLocaleDateString()}</span>
          <span className={`od-badge ${order.status.toLowerCase()}`}>{order.status}</span>
          <span><strong>Total:</strong> ₹{order.total}</span>
        </div>
      </header>

      <div className="od-progress">
        <div
          className={`od-progress-bar ${
            order.status === "delivered"
              ? "delivered"
              : order.status === "cancelled"
              ? "cancelled"
              : "inprogress"
          }`}
        />
        <div className="od-progress-steps">
          <span>Placed</span>
          <span>Shipped</span>
          <span>Delivered</span>
        </div>
      </div>

      <section className="od-section">
        <h2 className="od-subtitle">Shipping Address</h2>
        <div className="od-address">
          <p>{order.shipping_address?.title}</p>
          <p>{order.shipping_address?.address_line1}</p>
          <p>{order.shipping_address?.city} - {order.shipping_address?.pincode}</p>
        </div>
      </section>

      <section className="od-section">
        <h2 className="od-subtitle">Items</h2>
        <div className="od-items">
          {order.details.map((item, i) => (
            <div key={i} className="od-item">
              <img
                src={item.product?.images?.[0]?.url_full || ""}
                alt={item.product?.name}
                className="od-thumb"
              />
              <div className="od-item-info">
                <p className="od-item-name">{item.product?.name}</p>
                <p className="od-item-meta">
                  Qty: {item.quantity} • ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="od-footer">
        <button className="od-btn outline">Download Invoice</button>
        <button className="od-btn">Buy Again</button>
      </footer>
    </div>
  );
}
