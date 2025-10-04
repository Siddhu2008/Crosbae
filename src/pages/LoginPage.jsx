import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getGoogleClientId } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { login } from "../api/auth";

const LoginPage = () => {
  const [clientId, setClientId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getGoogleClientId().then((res) => {
      setClientId(res.data.GOOGLE_OAUTH_CLIENT_ID);
    });
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    alert("Login Successful");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username: email, password });
      handleLogin(res.data);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="mb-4 text-center">Sign in</h3>

        {/* Google Button */}
        {clientId && (
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLoginButton onLogin={handleLogin} />
          </GoogleOAuthProvider>
        )}

        <div className="text-center mb-3 fw-bold">OR</div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address or Username
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or username"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          <div className="mb-2 text-end">
            <Link
              to="/forgot-password"
              style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}
            >
              Forgotten your password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ background: "#f19e04ff" }}
          >
            Sign in
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/register" className="register">
            <span
              style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}
            >
              Create a new Account? Sign up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
