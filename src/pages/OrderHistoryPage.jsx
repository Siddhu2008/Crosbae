// src/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OrderHistory.css";
import API_URL from "../api/auth";
import { useProduct } from "../contexts/ProductContext";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  const { state: productState } = useProduct();
  const { products } = productState;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="order-history">
        <p>Loading orders...</p>
      </div>
    );
  }

  // 🔍 Helper: Enrich product data like in OrderItemsSection
  const getEnrichedProductData = (orderItem) => {
    // Try to find the product in ProductContext
    const productFromContext = products.find(
      (p) => p.id === orderItem.product?.id || p.id === orderItem.product
    );

    if (productFromContext) {
      return {
        name: productFromContext.name,
        price: productFromContext.price,
        image: productFromContext.images?.[0]?.url_full || "/fallback-image.jpg",
        isAvailable: true,
      };
    }

    // Fallback: use order API data
    return {
      name:
        orderItem.product?.name || orderItem.product_name || "Product Not Available",
      price: orderItem.price || orderItem.product_price || "—",
      image:
        orderItem.product?.images?.[0]?.url_full ||
        orderItem.product?.images?.[0]?.url ||
        "/fallback-image.jpg",
      isAvailable: false,
    };
  };

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
          <Link to="/shop" className="oh-cta">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="oh-list">
          {orders.map((order) => (
            <article key={order.uuid} className="oh-card">
              <header className="oh-card-head">
                <div className="oh-id">
                  <span className="oh-label">Order ID</span>
                  <span className="oh-value mono">{order.uuid}</span>
                </div>
                <div className="oh-date">
                  <span className="oh-label">Date</span>
                  <time className="oh-value">
                    {new Date(order.order_on).toLocaleDateString()}
                  </time>
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

              <div className="oh-progress" aria-hidden="true">
                <div
                  className={`oh-progress-bar ${
                    order.status === "delivered"
                      ? "delivered"
                      : order.status === "cancelled"
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

              <div className="oh-items">
                {order.details.slice(0, 2).map((item, idx) => {
                  const productData = getEnrichedProductData(item);
                  return (
                    <div key={idx} className="oh-item">
                      <img
                        className="oh-thumb"
                        src={productData.image}
                        alt={productData.name}
                        onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      />
                      <div className="oh-item-info">
                        <p className="oh-item-name">
                          {productData.name}
                          {!productData.isAvailable && (
                            <span className="unavailable-badge">
                              {" "}
                              (No Longer Available)
                            </span>
                          )}
                        </p>
                        <div className="oh-item-meta">
                          <span>Qty: {item.quantity}</span>
                          <span className="dot">•</span>
                          <span>₹{productData.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="oh-card-foot">
                <Link
                  to={`/orders/${order.uuid}`}
                  className="oh-btn outline text-decoration-none"
                >
                  View Details
                </Link>
                <Link
                  to={`/orders/${order.uuid}/tracking`}
                  className="oh-btn outline text-decoration-none ms-2"
                >
                  Track Order
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
