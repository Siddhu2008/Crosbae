import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

export default function EditProduct() {
  const navigate = useNavigate();

  // Example product data — this would normally come from props or API
  const [product, setProduct] = useState({
    name: "Gold Necklace",
    category: "Necklace",
    price: "25000",
    stock: "15",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.bT6r6Wdmg6HAnSXKNUXfTQHaE8?pid=Api&P=0&w=300&h=300",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Product updated successfully!");
    navigate("/admin");
  };

  return (
    <div
      className="admin-dashboard"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <h2 className="text-center mb-4">Edit Product</h2>
      <div className="form-container">
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
        />

        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
        />

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={product.image}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="cancel-btn" onClick={() => navigate("/admin")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
