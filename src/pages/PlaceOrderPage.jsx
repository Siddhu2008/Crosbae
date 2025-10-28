import React from "react";
import { Link } from "react-router-dom";
import "../styles/PlaceOrderPage.css";
import Seo from "../components/Seo";

export default function PlaceOrderPage() {
  // In a real app, you'd fetch/order details from context, redux or API.
  // Here is a simple static confirmation example.

  return (
    <div className="placeorder-container container">
      <Seo title="Order Confirmation" noIndex />
      <div className="confirmation-box">
        <h2 className="confirmation-title">Thank You for Your Order!</h2>
        <p className="confirmation-msg">Your order has been placed successfully. We’re processing it and will notify you once it ships.</p>

        <div className="order-summary-box">
          <h3>Order Summary</h3>
          <ul>
            <li>
              <strong>Order Number:</strong> #123456789
            </li>
            <li>
              <strong>Estimated Delivery:</strong> 3-5 business days
            </li>
            <li>
              <strong>Payment Method:</strong> Credit Card</li>
            <li><strong>Shipping Address:</strong> 123 Main Street, New York, NY 10001
            </li>
          </ul>
        </div>

        <Link to="/" className="btn-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
