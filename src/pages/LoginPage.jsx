import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { getGoogleClientId, googleLogin, login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [clientId, setClientId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Fetch Google Client ID
  useEffect(() => {
    getGoogleClientId()
      .then((res) => {
        console.debug("fetched Google client id:", res.data.GOOGLE_OAUTH_CLIENT_ID);
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
    }
    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    console.debug("google credentialResponse:", credentialResponse);
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        console.error("No credential from Google. Ensure origin is authorized and COOP/COEP headers are not blocking.");
        setLoading(false);
        return;
      }
      const data = await googleLogin(credentialResponse.credential);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (setUser && data.user_data) setUser(data.user_data);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
    setLoading(false);
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      {loading && <Loader />}

      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
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
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
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
