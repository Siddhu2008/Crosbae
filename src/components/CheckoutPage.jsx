import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CheckoutPage() { // Note: This seems to be a duplicate of pages/CheckoutPage.jsx
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    alert("Your order has been placed successfully!");
    localStorage.removeItem("cartItems");
    navigate("/"); // redirect home or to order success page
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="container"
        style={{ paddingTop: "120px", paddingBottom: "100px" }}
      >
        <h2 className="text-center mb-4">Checkout</h2>
        <p className="text-center">Your cart is empty.</p>
        <div className="text-center">
          <Link to="/shop" className="btn btn-outline-primary">
            Browse Jewellery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <h2 className="mb-4 text-center">Checkout</h2>

      <div className="row">
        {/* Billing Form */}
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm mb-4">
            <h5 className="mb-3">Billing Information</h5>
            <form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="123 Street, City"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Method</label>
                <select className="form-select" required>
                  <option value="">Select Payment Method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Order Summary</h5>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-2"
              >
                <span>
                  {item.productName} x {item.quantity}
                </span>
                <span>₹ {item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <h6>Total: ₹ {calculateTotal()}</h6>
            <button
              className="btn btn-dark w-100 mt-3"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
            <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
