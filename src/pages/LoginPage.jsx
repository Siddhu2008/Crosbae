import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { getGoogleClientId, googleLogin, login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
// local internal loader will be used instead of global loader

const LoginPage = () => {
  const [clientId, setClientId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // internal overlay spinner will be displayed while `loading` is true

  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Fetch Google Client ID
  useEffect(() => {
    getGoogleClientId()
      .then((res) => {
        setClientId(res.data.GOOGLE_OAUTH_CLIENT_ID);
      })
      .catch((err) => console.error("Failed to fetch Google client ID:", err));
  }, []);

  // Handle normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
  setLoading(true);
    try {
      const data = await login({ username: email, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (setUser && data.user_data) setUser(data.user_data);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials or network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
  setLoading(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (setUser && data.user_data) setUser(data.user_data);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
  {/* page loader handles loading overlay */}

      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%", position: "relative" }}>
        {/* internal overlay shown only for this page while authenticating */}
        {loading && (
          <div
            aria-hidden={!loading}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: 6,
            }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Signing in...</span>
              </div>
              <div className="mt-2">Signing in...</div>
            </div>
          </div>
        )}
        <h3 className="mb-4 text-center">Sign in</h3>

        {/* Google Login */}
        {clientId && (
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
            />
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
              disabled={loading}
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
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
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
