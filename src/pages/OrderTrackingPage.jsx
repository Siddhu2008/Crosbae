import React from "react";
import "../styles/OrderTrackingPage.css";

const mockTrackingData = {
  orderId: "ORD123456789",
  status: "Shipped",
  steps: [
    { label: "Order Placed", completed: true },
    { label: "Processing", completed: true },
    { label: "Shipped", completed: true },
    { label: "Out for Delivery", completed: false },
    { label: "Delivered", completed: false },
  ],
  estimatedDelivery: "Sep 5, 2025",
};

const OrderTrackingPage = () => {
  return (
    <div className="order-tracking-page">
      <h2>Track Your Order</h2>
      <div className="order-info">
        <p><strong>Order ID:</strong> {mockTrackingData.orderId}</p>
        <p><strong>Current Status:</strong> {mockTrackingData.status}</p>
        <p><strong>Estimated Delivery:</strong> {mockTrackingData.estimatedDelivery}</p>
      </div>

      <div className="tracking-steps">
        {mockTrackingData.steps.map((step, index) => (
          <div
            key={index}
            className={`step ${step.completed ? "completed" : ""}`}
          >
            <div className="circle">{step.completed ? "✓" : index + 1}</div>
            <p>{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
