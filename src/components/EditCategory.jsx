import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

export default function EditCategory() {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "Necklaces",
    description: "All kinds of necklaces",
    imageUrl: "https://example.com/images/necklace-category.jpg",
    imageFile: null,
  });

  const [preview, setPreview] = useState(category.imageUrl);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setCategory((prev) => ({ ...prev, imageFile: file }));

      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Cleanup on unmount
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    console.log("Updated Category:", category);
    alert("Category updated successfully!");
    navigate("/admin");
  };

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
      <div className="form-card" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Edit Category</h2>

        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={category.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Category Description"
          value={category.description}
          onChange={handleChange}
          rows="3"
        />

        <label>Category Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <p>Image Preview:</p>
            <img
              src={preview}
              alt="Category Preview"
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
          onClick={() => navigate("/admin")}
          style={{ marginTop: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
