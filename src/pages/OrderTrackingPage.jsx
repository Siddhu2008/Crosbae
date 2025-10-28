import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // <-- import this
import "../styles/OrderTrackingPage.css";
import API_URL from "../api/auth";

const OrderTrackingPage = () => {
  const { id: orderId } = useParams(); // <-- get orderId from URL params
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!orderId) return; // early exit if no orderId

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (!order) return <div className="order-tracking-page"><p>Loading tracking info...</p></div>;
  const steps = [
    { label: "Order Placed", completed: true },
    { label: "Processing", completed: order.status !== "pending" },
    { label: "Shipped", completed: order.status === "shipped" || order.status === "delivered" },
    { label: "Out for Delivery", completed: order.status === "delivered" },
    { label: "Delivered", completed: order.status === "delivered" },
  ];

  return (
    <div className="order-tracking-page">
      <h2>Track Your Order</h2>
      <div className="order-info">
        <p><strong>Order ID:</strong> {order.uuid}</p>
        <p><strong>Current Status:</strong> {order.status}</p>
        <p><strong>Placed on:</strong> {new Date(order.order_on).toLocaleDateString()}</p>
      </div>

      <div className="tracking-steps">
        {steps.map((step, index) => (
          <div key={index} className={`step ${step.completed ? "completed" : ""}`}>
            <div className="circle">{step.completed ? "✓" : index + 1}</div>
            <p>{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
