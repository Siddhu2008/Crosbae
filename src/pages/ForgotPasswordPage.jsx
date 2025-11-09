import React, { useState } from "react";
import axios from "axios";
import API_URL from "../api/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handlSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password/`, { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Something went wrong");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-3">
      <div
        className="card shadow-sm w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Forgot Password</h2>
          <form onSubmit={handlSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Registered Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn w-100 text-white mb-2"
              style={{
                backgroundColor: "#D4AF37", // golden color
                borderColor: "#D4AF37",
                fontWeight: "bold",
              }}
            >
              Send Reset Link
            </button>
          </form>
          {msg && (
            <div className="alert alert-info mt-3 text-center small" role="alert">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
