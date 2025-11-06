import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";
import API_URL from "../api/auth";
import { useLoader } from "../contexts/LoaderContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    profile_pic: "",
    profilePicFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [_loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchUser = async () => {
      showLoader();
      try {
        const res = await axios.get(API_URL+"/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          ...res.data,
          profile_pic: res.data.profile_pic || "",
          profilePicFile: null,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user data.");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user.profilePicFile) {
      const objectUrl = URL.createObjectURL(user.profilePicFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [user.profilePicFile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_pic") {
      setUser((prev) => ({
        ...prev,
        profilePicFile: files[0],
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("gender", user.gender);
      formData.append("dob", user.dob);
      if (user.profilePicFile) {
        formData.append("profile_pic", user.profilePicFile);
      }
      await axios.patch(API_URL+"/auth/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  // global loader handles loading state

  return (
    <div
      className="admin-dashboard"
      style={{
        paddingTop: "120px",
        paddingBottom: "100px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="form-card" style={{ maxWidth: "550px", width: "100%" }}>
        <h2 className="text-center mb-4">Edit Profile</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          value={user.first_name}
          onChange={handleChange}
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={user.last_name}
          onChange={handleChange}
        />

        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={user.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="dob">Date of Birth</label>
        <input
          id="dob"
          type="date"
          name="dob"
          value={user.dob}
          onChange={handleChange}
        />

        <label htmlFor="profile_pic">Profile Picture</label>
        <input
          id="profile_pic"
          type="file"
          name="profile_pic"
          accept="image/*"
          onChange={handleChange}
        />

        {(preview || user.profile_pic) && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <p>Profile Picture Preview:</p>
            <img
              src={preview || user.profile_pic}
              alt="Profile Preview"
              style={{
                width: "150px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}

        <button
          className="save-btn"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Save Changes
        </button>
        <button
          className="cancel-btn"
          onClick={() => navigate("/profile")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
