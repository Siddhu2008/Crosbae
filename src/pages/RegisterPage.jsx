import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getGoogleClientId, register, login } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [clientId, setClientId] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    getGoogleClientId().then((res) => {
      setClientId(res.data.GOOGLE_OAUTH_CLIENT_ID);
    });
  }, []);

  const handleGoogleSignup = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    const returnedUser = data.user_data || data.user || null;
    if (setUser && returnedUser) setUser(returnedUser);
    navigate("/");
  };

  // Generate username from email if not provided
  // Generate username from email if not provided
    const generateUsername = (email) => {
      if (!email) {
        // Fallback if no email (shouldn't happen due to validation)
        return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      }
      
      const baseUsername = email.split('@')[0];
      // Remove any non-alphanumeric characters
      const cleanUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, '');
      const randomSuffix = Math.floor(Math.random() * 10000);
      
      // Ensure we have a valid base
      const finalBase = cleanUsername || 'user';
      
      return `${finalBase}${randomSuffix}`;
    };

  const validateForm = () => {
    const newErrors = {};

    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    // Password length validation
    if (formData.password.length < 8) {
      newErrors.password = ["Password must be at least 8 characters long"];
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    // Date of birth validation (basic)
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (dob > today) {
        newErrors.dob = ["Date of birth cannot be in the future"];
      } else if (age < 13) {
        newErrors.dob = ["You must be at least 13 years old to register"];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Frontend validation
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      
      let usernameToSend = formData.username;
          
          if (!usernameToSend || usernameToSend.trim() === '') {
            usernameToSend = generateUsername(formData.email);
          }

          // Ensure username is not empty
          if (!usernameToSend || usernameToSend.trim() === '') {
            setErrors({ username: ["Username cannot be empty"] });
            setIsSubmitting(false);
            return;
          }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        username: usernameToSend,
        password: formData.password,
      };

      const res = await register(payload);

    console.log("Registration response:", res); // Debug log

    // Option 1: Check if user data is returned (successful creation)
    if (res.data && res.data.id) {
      console.log("User created successfully with ID:", res.data.id);
      
      // If tokens are returned, use them
      if (res.data.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh || "");
        
        const returnedUser = res.data.user_data || res.data.user || res.data;
        if (setUser && returnedUser) setUser(returnedUser);
      }
      
      // Show success message and redirect to login
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
      return;
    }

    // Option 2: If no user data but no error, assume success
    if (res.status === 200 || res.status === 201) {
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
      return;
    }
    } catch (err) {
      if (err.response && err.response.data) {
        // Map backend errors to frontend field names
        const backendErrors = err.response.data;
        const mappedErrors = {};

        // Map specific backend error messages to frontend fields
        if (backendErrors.username) {
          mappedErrors.username = Array.isArray(backendErrors.username) 
            ? backendErrors.username 
            : [backendErrors.username];
        }

        if (backendErrors.email) {
          mappedErrors.email = Array.isArray(backendErrors.email) 
            ? backendErrors.email 
            : [backendErrors.email];
        }

        if (backendErrors.dob) {
          mappedErrors.dob = Array.isArray(backendErrors.dob) 
            ? backendErrors.dob 
            : [backendErrors.dob];
        }

        if (backendErrors.password) {
          mappedErrors.password = Array.isArray(backendErrors.password) 
            ? backendErrors.password 
            : [backendErrors.password];
        }

        if (backendErrors.first_name) {
          mappedErrors.first_name = Array.isArray(backendErrors.first_name) 
            ? backendErrors.first_name 
            : [backendErrors.first_name];
        }

        if (backendErrors.last_name) {
          mappedErrors.last_name = Array.isArray(backendErrors.last_name) 
            ? backendErrors.last_name 
            : [backendErrors.last_name];
        }

        // Handle non-field errors
        if (backendErrors.non_field_errors) {
          mappedErrors.non_field_errors = Array.isArray(backendErrors.non_field_errors) 
            ? backendErrors.non_field_errors 
            : [backendErrors.non_field_errors];
        }

        setErrors(mappedErrors);
      } else {
        setErrors({ non_field_errors: ["Registration failed. Please try again."] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-5"
      style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: 450, width: "100%", position: "relative" }}>
        {/* internal overlay shown only for this page while submitting */}
        {isSubmitting && (
          <div
            aria-hidden={!isSubmitting}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: 8,
            }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Signing up...</span>
              </div>
              <div className="mt-2">Creating your account...</div>
            </div>
          </div>
        )}
        <h3 className="mb-4 text-center">Sign up</h3>

        {/* Non-field errors */}
        {errors.non_field_errors && (
          <div className="alert alert-danger" role="alert">
            {errors.non_field_errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {clientId && (
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLoginButton onLogin={handleGoogleSignup} />
          </GoogleOAuthProvider>
        )}

        <div className="text-center mb-3 fw-bold">OR</div>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name *</label>
            <input
              type="text"
              className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              required
            />
            {errors.first_name && (
              <div className="invalid-feedback">
                {errors.first_name.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name *</label>
            <input
              type="text"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              required
            />
            {errors.last_name && (
              <div className="invalid-feedback">
                {errors.last_name.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Username (Optional) */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username <small className="text-muted">(Optional)</small>
            </label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Leave blank to auto-generate"
            />
            {errors.username && (
              <div className="invalid-feedback">
                {errors.username.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              className="form-select"
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth *</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              id="dob"
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              required
            />
            {errors.dob && (
              <div className="invalid-feedback">
                {errors.dob.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password *</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength="8"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
              </button>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
            <small className="form-text text-muted">Password must be at least 8 characters long</small>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
              </button>
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ background: "#f19e04ff" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="login">
            <span style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}>
              Already have an account? Sign in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;