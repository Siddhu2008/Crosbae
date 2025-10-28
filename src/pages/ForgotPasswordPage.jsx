import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${email}`);
    setEmail("");
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      <Seo title="Forgot Password" noIndex />
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="mb-4 text-center">Forgot Password</h3>
        <p className="text-center" style={{ fontSize: 14 }}>
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ background: "#f19e04ff" }}
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="login">
            <span
              style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}
            >
              Back to Sign In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
