import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../api/auth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });

  // state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      // If API returns tokens and user data, store them
      if (res.data.access) {
        localStorage.setItem("access", res.data.access);
        if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
        const returnedUser = res.data.user_data || res.data.user || null;
        if (setUser && returnedUser) setUser(returnedUser);
        alert("Registration successful");
        navigate("/");
      } else {
        // If register didn't return tokens, attempt login with provided credentials
        try {
          const loginRes = await login({ username: formData.email, password: formData.password });
          if (loginRes.data.access) {
            localStorage.setItem("access", loginRes.data.access);
            if (loginRes.data.refresh) localStorage.setItem("refresh", loginRes.data.refresh);
            const returnedUser = loginRes.data.user_data || loginRes.data.user || null;
            if (setUser && returnedUser) setUser(returnedUser);
            alert("Registration successful — logged in");
            navigate("/");
          } else {
            alert("Registration successful. Please log in.");
            navigate("/login");
          }
        } catch (err) {
          console.error("Auto-login failed after registration:", err);
          alert("Registration successful. Please log in.");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const handleGoogleSignup = () => {
    alert("Google sign-up clicked (no functionality yet)");
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-5 "
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: 450, width: "100%" }}>
        <h3 className="mb-4 text-center">Sign up</h3>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          className="btn text-black bg-white border-secondary w-100 d-flex align-items-center justify-content-center mb-3"
          style={{ gap: 10 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-18.4-1.5-36-4.4-53.3H272v100.9h146.9c-6.3 33.8-25 62.5-53.5 81.6v67h86.3c50.6-46.7 81.8-115.2 81.8-196.2z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c72.8 0 134-24.1 178.7-65.4l-86.3-67c-24 16.1-55 25.7-92.4 25.7-70.9 0-131-47.9-152.5-112.1h-89.9v70.4c44.6 88.4 136.1 148.4 242.4 148.4z"
            />
            <path
              fill="#FBBC05"
              d="M119.5 321.5c-9.6-28.3-9.6-58.9 0-87.2v-70.4h-89.9c-39.5 77-39.5 169.3 0 246.3l89.9-70.4z"
            />
            <path
              fill="#EA4335"
              d="M272 107.7c38.3 0 72.8 13.2 99.9 39.1l74.8-74.8C402.9 24.1 341.7 0 272 0 165.7 0 74.2 59.9 29.6 148.3l89.9 70.4c21.6-64.2 81.7-112.1 152.5-112.1z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="text-center mb-3 fw-bold">OR</div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
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

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ background: "#f19e04ff" }}
          >
            Sign up
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="login">
            <span
              style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}
            >
              Already have an account? Sign in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
