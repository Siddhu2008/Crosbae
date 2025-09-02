// src/pages/OrderHistoryPage.jsx

import React, { useEffect, useState } from "react";
import "../styles/OrderHistory.css"; // make sure you create this

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
        image: "https://i.pinimg.com/736x/11/82/fa/1182fa5e7e9827d208ec3344fbae7ab5.jpg"
      },
      {
        name: "Diamond Earrings",
        price: 600,
        qty: 1,
        image: "https://d2ma7w4w9grdob.cloudfront.net/media/45100-IND_2930.JPG"
      }
    ]
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
        image: "https://www.orra.co.in/media/catalog/product/o/r/org22019_1_m2xicjnhbgtdbr3r.jpg",
      }
    ]
  }
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    
    setOrders(dummyOrders);
  }, []);

  return (
    <div className="order-history container">
      <h2 className="text-center mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Date:</strong> {order.date}</div>
              <div><strong>Status:</strong> {order.status}</div>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p>Qty: {item.qty}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total:</strong> ₹{order.total}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
