import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

export default function AddCategory() {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    imageFile: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setCategory((prev) => ({ ...prev, imageFile: file }));

      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }
    } else {
      setCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category Added:", category);
    alert("Category added successfully!");
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
        <h2 className="text-center mb-4">Add Category</h2>

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

        <label>Category Image (optional)</label>
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
              alt="Preview"
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
          onClick={handleSubmit}
          style={{ marginTop: "20px" }}
        >
          Save Category
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
