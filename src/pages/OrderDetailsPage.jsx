import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/OrderDetails.css";
import API_URL from "../api/auth";
import { useCart } from "../contexts/CartContext";
import OrderItemsSelection from "../components/OrderItemsSelection";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (val) =>
    typeof val === "number" ? val.toFixed(2) : Number(val || 0).toFixed(2);

  const statusClass =
    {
      placed: "inprogress",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    }[order?.status?.toLowerCase()] || "inprogress";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${id}/`, {
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

  if (loading)
    return (
      <div className="order-details container">
        <p>Loading order...</p>
      </div>
    );
  if (!order)
    return (
      <div className="order-details container">
        <p>Order not found.</p>
      </div>
    );

  return (
    <div className="order-details container">
      <header className="od-header">
        <Link to="/orders" className="od-back">
          ← Back to Orders
        </Link>
        <h1 className="od-title">Order #{order.uuid}</h1>
      </header>

      <div className="od-summary-box">
        <div className="od-summary-header">
          <div>
            <p>
              <strong>Placed On:</strong>{" "}
              {new Date(order.order_on).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`od-badge ${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
          </div>
          <div className="od-price-summary">
            <p>Subtotal: ₹{formatPrice(order.subtotal)}</p>
            <p>Discount: -₹{formatPrice(order.discount)}</p>
            <p>Shipping: ₹{formatPrice(order.shipping)}</p>
            <hr />
            <p className="od-total">
              Total: <span>₹{formatPrice(order.total)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="od-progress">
        <div className={`od-progress-bar ${statusClass}`} />
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
          <p>
            {order.shipping_address?.city} - {order.shipping_address?.pincode}
          </p>
        </div>
      </section>

      <OrderItemsSelection order={order} />

      <footer className="od-footer">
        <button
          className="od-btn outline"
          onClick={async () => {
            try {
              const response = await fetch(`${API_URL}/orders/${id}/invoice/`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = `invoice-${id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } else {
                alert("Failed to download invoice");
              }
            } catch (error) {
              console.error("Error downloading invoice:", error);
              alert("Error downloading invoice");
            }
          }}
        >
          Download Invoice
        </button>

        <button
          className="od-btn primary"
          onClick={() => {
            order.details.forEach((item) =>
              addToCart(item.product, item.quantity)
            );
            navigate("/cart");
          }}
        >
          Buy Again
        </button>
      </footer>
    </div>
  );
}
