import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const ResetPasswordPage = () => {
  // Example: we could get a token from the query string (not used currently)

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Here you’d send token + new password to your API
    alert(`Password has been reset successfully!`);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      <Seo title="Reset Password" noIndex />
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="mb-4 text-center">Reset Password</h3>
        <p className="text-center" style={{ fontSize: 14 }}>
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ background: "#f19e04ff" }}
          >
            Reset Password
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

export default ResetPasswordPage;
