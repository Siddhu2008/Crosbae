import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api/user";
import "../styles/AdminDashboard.css";
import { useLoader } from "../contexts/LoaderContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    image_url: "",
    image_file: null,
  });
  const [preview, setPreview] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const token = localStorage.getItem("access");

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      showLoader();
  const data = await getUserProfile(token);
      
      const userData = {
        id: data.id || data.user?.id || "",
        username: data.username || data.user?.username || "",
        email: data.email || data.user?.email || "",
        first_name: data.first_name || data.user?.first_name || "",
        last_name: data.last_name || data.user?.last_name || "",
        gender: data.gender || data.user?.gender || "",
        dob: data.dob || data.user?.dob || "",
        image_url: data.image_url || data.user?.image_url || "",
        image_file: null,
      };
      
      setUser(userData);
      
      if (userData.image_url) {
        const fullUrl = getFullImageUrl(userData.image_url);
        setPreview(fullUrl);
      } else {
        setPreview(null);
      }
      
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("Failed to fetch user data.");
    } finally {
      setLoading(false);
      hideLoader();
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Fixed file preview effect with proper cleanup
  useEffect(() => {
    let objectUrl = null;
    
    if (user.image_file) {
      try {
        objectUrl = URL.createObjectURL(user.image_file);
        setPreview(objectUrl);
      } catch (error) {
        console.error("Error creating object URL:", error);
        setErrors(prev => ({ ...prev, image_file: "Invalid image file" }));
        setPreview(null);
      }
    }
    
    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user.image_file]);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = "https://cdn.crosbae.com";
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    return `${baseUrl}/${cleanPath}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!user.username.trim()) {
      newErrors.username = "Username is required";
    } else if (user.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (user.username.length > 150) {
      newErrors.username = "Username cannot exceed 150 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name validation
    if (user.first_name && user.first_name.length > 50) {
      newErrors.first_name = "First name must be less than 50 characters";
    }

    if (user.last_name && user.last_name.length > 50) {
      newErrors.last_name = "Last name must be less than 50 characters";
    }

    // Date of birth validation
    if (user.dob) {
      const dobDate = new Date(user.dob);
      const today = new Date();
      
      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
      
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 13);
      
      if (dobDate > minAgeDate) {
        newErrors.dob = "You must be at least 13 years old";
      }
      
      const maxAgeDate = new Date();
      maxAgeDate.setFullYear(today.getFullYear() - 120);
      
      if (dobDate < maxAgeDate) {
        newErrors.dob = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (name === "image_file") {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, image_file: "Please select an image file" }));
          return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, image_file: "Image must be less than 5MB" }));
          return;
        }

        setUser((prev) => ({
          ...prev,
          image_file: file,
        }));
      }
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user.id) {
        alert("User ID is missing. Please refresh and try again.");
        return;
      }

      let updateData;

      if (user.image_file) {
        updateData = new FormData();
        updateData.append("username", user.username.trim());
        updateData.append("email", user.email.trim());
        updateData.append("first_name", user.first_name?.trim() || "");
        updateData.append("last_name", user.last_name?.trim() || "");
        updateData.append("gender", user.gender || "");
        updateData.append("dob", user.dob || "");
        updateData.append("is_active", "true");
        updateData.append("image_file", user.image_file);

  // sending FormData with file
      } else {
        const profilePicValue = user.image_url || null;
        
        updateData = {
          username: user.username.trim(),
          email: user.email.trim(),
          first_name: user.first_name?.trim() || "",
          last_name: user.last_name?.trim() || "",
          gender: user.gender || "",
          dob: user.dob || "",
          is_active: true,
          image_url: profilePicValue,
        };
  // sending JSON data
      }

  // updating user id and data

      await updateUserProfile(user.id, updateData, token);
      
      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      
      // Handle backend validation errors
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        const mappedErrors = {};

        // Map backend errors to frontend field names
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

        if (backendErrors.dob) {
          mappedErrors.dob = Array.isArray(backendErrors.dob) 
            ? backendErrors.dob 
            : [backendErrors.dob];
        }

        if (backendErrors.gender) {
          mappedErrors.gender = Array.isArray(backendErrors.gender) 
            ? backendErrors.gender 
            : [backendErrors.gender];
        }

        if (backendErrors.image_file || backendErrors.image_url) {
          const imageError = backendErrors.image_file || backendErrors.image_url;
          mappedErrors.image_file = Array.isArray(imageError) 
            ? imageError 
            : [imageError];
        }

        // Handle non-field errors
        if (backendErrors.non_field_errors) {
          mappedErrors.non_field_errors = Array.isArray(backendErrors.non_field_errors) 
            ? backendErrors.non_field_errors 
            : [backendErrors.non_field_errors];
        }

        // Handle generic error messages
        if (backendErrors.detail) {
          mappedErrors.non_field_errors = Array.isArray(backendErrors.detail) 
            ? backendErrors.detail 
            : [backendErrors.detail];
        }

        setErrors(mappedErrors);

        // Show alert for non-field errors
        if (mappedErrors.non_field_errors) {
          alert(`Error: ${mappedErrors.non_field_errors.join(', ')}`);
        }
      } else {
        alert("❌ Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProfilePic = getFullImageUrl(user.image_url);

  // global loader displays while fetching profile

  return (
    <div
      className="admin-dashboard"
      style={{
        paddingTop: "120px",
        paddingBottom: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
      }}
    >
      <div className="form-card" style={{ 
        maxWidth: "550px", 
        width: "100%",
        marginTop: "20px"
      }}>
        <h2 className="text-center mb-4">Edit Profile</h2>

        {/* Non-field errors display */}
        {errors.non_field_errors && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: "20px" }}>
            {Array.isArray(errors.non_field_errors) ? (
              errors.non_field_errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))
            ) : (
              <div>{errors.non_field_errors}</div>
            )}
          </div>
        )}

        {/* Image file errors */}
        {errors.image_file && (
          <div className="error-message" style={{ textAlign: "center" }}>
            {Array.isArray(errors.image_file) ? (
              errors.image_file.map((error, index) => (
                <div key={index}>{error}</div>
              ))
            ) : (
              <div>{errors.image_file}</div>
            )}
          </div>
        )}

        {/* Profile Picture Section */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          backgroundColor: "#f8fafc"
        }}>
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <img
              src={preview || "https://media.crosbae.com/users/download.jpeg"}
              alt="Current Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "4px solid #ffffff",
              }}
              onError={(e) => {
                e.target.src = "https://media.crosbae.com/users/download.jpeg";
              }}
            />
          </div>
          
          <p style={{ 
            margin: "0 0 15px 0", 
            fontWeight: "600",
            color: currentProfilePic ? "#059669" : "#6b7280"
          }}>
            {user.image_file ? "New Picture Selected" : 
             currentProfilePic ? "Current Profile Picture" : "No Profile Picture"}
          </p>

          {/* File input */}
          <div style={{ width: "100%", maxWidth: "300px" }}>
            <label htmlFor="image_file" style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              textAlign: "center"
            }}>
              Change Profile Picture
            </label>
            <input
              id="image_file"
              type="file"
              name="image_file"
              accept="image/*"
              onChange={handleChange}
              style={{ width: "100%" }}
              className={errors.image_file ? "error" : ""}
            />
            {errors.image_file && (
              <div className="error-message" style={{ textAlign: "center" }}>
                {errors.image_file.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {user.image_file && (
            <div style={{ 
              marginTop: "15px", 
              textAlign: "center",
              padding: "10px",
              border: "2px dashed #10b981",
              borderRadius: "8px",
              backgroundColor: "#f0fdf4"
            }}>
              <p style={{ 
                margin: "0 0 8px 0", 
                fontWeight: "600",
                color: "#059669",
                fontSize: "14px"
              }}>
                New picture preview (will replace current)
              </p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="required">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="error-message">
                {/* Handle both string and array errors */}
                {Array.isArray(errors.username) ? (
                  errors.username.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.username}</div>
                )}
              </div>
            )}
            
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="required">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <div className="error-message">
                {Array.isArray(errors.email) ? (
                  errors.email.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.email}</div>
                )}
              </div>
            )}
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={user.first_name || ""}
              onChange={handleChange}
              className={errors.first_name ? "error" : ""}
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <div className="error-message">
                {Array.isArray(errors.first_name) ? (
                  errors.first_name.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.first_name}</div>
                )}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={user.last_name || ""}
              onChange={handleChange}
              className={errors.last_name ? "error" : ""}
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <div className="error-message">
                {Array.isArray(errors.last_name) ? (
                  errors.last_name.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.last_name}</div>
                )}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={user.gender || ""}
              onChange={handleChange}
              className={errors.gender ? "error" : ""}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <div className="error-message">
                {Array.isArray(errors.gender) ? (
                  errors.gender.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.gender}</div>
                )}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              name="dob"
              value={user.dob || ""}
              onChange={handleChange}
              className={errors.dob ? "error" : ""}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && (
              <div className="error-message">
                {Array.isArray(errors.dob) ? (
                  errors.dob.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                ) : (
                  <div>{errors.dob}</div>
                )}
              </div>
            )}
           
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="cancel-btn"
            onClick={() => navigate("/profile")}
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>

        {/* Required fields note */}
        <div style={{ 
          marginTop: "15px", 
          textAlign: "center",
          fontSize: "14px",
          color: "#6b7280"
        }}>
          <span className="required">*</span> Required fields
        </div>
      </div>

  <style>{`
        .required::after {
          content: " *";
          color: #dc2626;
        }
        .error {
          border-color: #dc2626 !important;
        }
        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-top: 5px;
        }
        .alert-danger {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}