// src/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OrderHistory.css";
import API_URL from "../api/auth";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

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

  // Helper: resolve product display info safely
  const resolveProductInfo = (productOrId) => {
    // If product is missing or falsy
    if (!productOrId) return { name: "Product", image: "/fallback-image.jpg", id: null };

    // If we only have an id (number or string), show fallback and keep id
    if (typeof productOrId === "string" || typeof productOrId === "number") {
      return { name: `Product #${productOrId}`, image: "/fallback-image.jpg", id: productOrId };
    }

    // It's an object — try to extract name/id
    const prod = productOrId;
    const name = prod.productName || prod.name || prod.title || prod.displayName || "Product";
    const id = prod.id || prod.product_id || null;

    // Resolve image: support array of strings, array of objects, single string, or object with url/url_full
    let image = "/fallback-image.jpg";
    if (Array.isArray(prod.images) && prod.images.length) {
      const first = prod.images[0];
      if (typeof first === "string") image = first;
      else if (first && (first.url_full || first.url)) image = first.url_full || first.url;
    } else if (typeof prod.images === "string" && prod.images) {
      image = prod.images;
    } else if (prod.image) {
      image = prod.image;
    } else if (prod.image_url) {
      image = prod.image_url;
    } else if (prod.thumbnail) {
      image = prod.thumbnail;
    }

    return { name, image, id };
  };

  if (loading) {
    return <div className="order-history"><p>Loading orders...</p></div>;
  }

  return (
    <div className="order-history">
      <div className="oh-header">
        <h1 className="oh-title">My Orders</h1>
        <p className="oh-subtitle">Track your purchases and revisit your favourite pieces.</p>
      </div>

      {orders.length === 0 ? (
        <div className="oh-empty">
          <div className="oh-empty-icon" aria-hidden="true">💎</div>
          <p className="oh-empty-text">You haven’t placed any orders yet.</p>
          <Link to="/shop" className="oh-cta">Start Shopping</Link>
        </div>
      ) : (
        <div className="oh-list">
          {orders.map((order) => (
            <article key={order.uuid} className="oh-card" aria-label={`Order ${order.uuid}`}>
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
                  const { name, image, id: prodId } = resolveProductInfo(item.product);
                  const productLink = prodId ? `/product/${prodId}` : undefined;
                  return (
                    <div key={idx} className="oh-item">
                      {productLink ? (
                        <Link to={productLink} className="oh-thumb-link">
                          <img className="oh-thumb" src={image} alt={name} />
                        </Link>
                      ) : (
                        <img className="oh-thumb" src={image} alt={name} />
                      )}

                      <div className="oh-item-info">
                        <p className="oh-item-name">{name}</p>
                        <div className="oh-item-meta">
                          <span>Qty: {item.quantity}</span>
                          <span className="dot" aria-hidden="true">•</span>
                          <span>₹{item.price}</span>
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
