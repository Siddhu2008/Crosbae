import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/OrderDetails.css";

// We can reuse the same dummyOrders from history page or fetch from API
const dummyOrders = [
  {
    id: "ORD123",
    date: "2025-08-20",
    total: 3099,
    status: "Delivered",
    cancelStage: null,
    address: {
      name: "Siddhu Kumar",
      line1: "123 Gold Street",
      city: "Mumbai",
      pincode: "400001",
      phone: "9876543210",
    },
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
    cancelStage: null,
    address: {
      name: "Siddhu Kumar",
      line1: "123 Gold Street",
      city: "Mumbai",
      pincode: "400001",
      phone: "9876543210",
    },
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
    cancelStage: 1, // 0 placed, 1 shipped
    address: {
      name: "Siddhu Kumar",
      line1: "123 Gold Street",
      city: "Mumbai",
      pincode: "400001",
      phone: "9876543210",
    },
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

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulate fetching order by id
    const found = dummyOrders.find((o) => o.id === id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return (
      <div className="order-details container">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-details container">
      <header className="od-header">
        <Link to="/orders" className="od-back">
          ← Back to Orders
        </Link>
        <h1 className="od-title">Order {order.id}</h1>
        <div className="od-meta">
          <span>
            <strong>Date:</strong> {order.date}
          </span>
          <span className={`od-badge ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
          <span>
            <strong>Total:</strong> ₹{order.total}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="od-progress">
        <div
          className={`od-progress-bar ${
            order.status === "Delivered"
              ? "delivered"
              : order.status === "Cancelled"
              ? "cancelled"
              : "inprogress"
          }`}
          style={
            order.status === "Cancelled"
              ? {
                  "--cancel-width":
                    order.cancelStage === 0
                      ? "33%"
                      : order.cancelStage === 1
                      ? "66%"
                      : "100%",
                }
              : {}
          }
        />
        <div className="od-progress-steps">
          <span>Placed</span>
          <span>Shipped</span>
          <span>Delivered</span>
        </div>
      </div>

      {/* Shipping */}
      <section className="od-section">
        <h2 className="od-subtitle">Shipping Address</h2>
        <div className="od-address">
          <p>{order.address.name}</p>
          <p>{order.address.line1}</p>
          <p>
            {order.address.city} - {order.address.pincode}
          </p>
          <p>Phone: {order.address.phone}</p>
        </div>
      </section>

      {/* Items */}
      <section className="od-section">
        <h2 className="od-subtitle">Items</h2>
        <div className="od-items">
          {order.items.map((item, i) => (
            <div key={i} className="od-item">
              <img src={item.image} alt={item.name} className="od-thumb" />
              <div className="od-item-info">
                <p className="od-item-name">{item.name}</p>
                <p className="od-item-meta">
                  Qty: {item.qty} • ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <footer className="od-footer">
        <button className="od-btn outline">Download Invoice</button>
        <button className="od-btn">Buy Again</button>
      </footer>
    </div>
  );
}
