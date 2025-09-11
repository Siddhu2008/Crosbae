import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

export default function DeleteCategory() {
  const navigate = useNavigate();

  const handleDelete = () => {
    alert("Category deleted successfully!");
    navigate("/admin");
  };

  return (
    <div
      className="admin-dashboard"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <h2 className="text-center mb-4 text-danger">Delete Category</h2>
      <div className="delete-card">
        <p>
          Are you sure you want to delete <strong>Necklaces</strong> category?
          This action cannot be undone.
        </p>
        <div className="form-actions">
          <button className="delete-btn" onClick={handleDelete}>
            Yes, Delete
          </button>
          <button className="cancel-btn" onClick={() => navigate("/admin")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
