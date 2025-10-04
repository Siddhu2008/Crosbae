import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Your shared styles

export default function EditProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "Gold Necklace",
    category: "Necklace",
    purity: "22K",
    price: "25000",
    description: "Elegant handcrafted gold necklace.",
    imageUrl: "https://example.com/images/gold-necklace.jpg",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct((prev) => ({
        ...prev,
        imageFile: files[0],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product.imageFile) {
      const objectUrl = URL.createObjectURL(product.imageFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [product.imageFile]);

  const handleSave = () => {
    alert("Product updated successfully!");
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
      <div className="form-card" style={{ maxWidth: "550px", width: "100%" }}>
        <h2 className="text-center mb-4">Edit Product</h2>

        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Necklace">Necklace</option>
          <option value="Ring">Ring</option>
          <option value="Bracelet">Bracelet</option>
          <option value="Earrings">Earrings</option>
        </select>

        <label htmlFor="purity">Purity</label>
        <select
          id="purity"
          name="purity"
          value={product.purity}
          onChange={handleChange}
          required
        >
          <option value="">Select Purity</option>
          <option value="22K">22K</option>
          <option value="18K">18K</option>
          <option value="14K">14K</option>
        </select>

        <label htmlFor="price">Price (₹)</label>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={product.price}
          onChange={handleChange}
          required
          min="0"
        />

        <label htmlFor="description">Product Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Product Description"
          rows="4"
          value={product.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={handleChange}
          style={{ marginBottom: "10px" }}
        />

        <label htmlFor="image">Upload New Image</label>
        <input id="image" type="file" name="image" onChange={handleChange} />

        {preview && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <p>New Image Preview:</p>
            <img
              src={preview}
              alt="New Preview"
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
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
