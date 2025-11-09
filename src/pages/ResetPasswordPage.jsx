import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../api/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Passwords do not match!");
      setMsgType("danger");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/confirm/`, {
        uid,
        token,
        new_password: password,
      });
      setMsg(res.data.message);
      setMsgType("success");
    } catch {
      setMsg("Link invalid or expired");
      setMsgType("danger");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-3">
      <div className="card shadow-sm w-100" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi position-absolute top-50 end-0 translate-middle-y me-3 ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                }`}
                style={{ cursor: "pointer", fontSize: "1.1rem" }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <i
                className={`bi position-absolute top-50 end-0 translate-middle-y me-3 ${
                  showConfirm ? "bi-eye-slash" : "bi-eye"
                }`}
                style={{ cursor: "pointer", fontSize: "1.1rem" }}
                onClick={() => setShowConfirm(!showConfirm)}
              ></i>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white mb-2"
              style={{
                backgroundColor: "#D4AF37",
                borderColor: "#D4AF37",
                fontWeight: "bold",
              }}
            >
              Reset Password
            </button>
          </form>

          {msg && (
            <div
              className={`alert alert-${msgType} mt-3 text-center small`}
              role="alert"
            >
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
