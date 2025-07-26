import React, { useState } from "react";
import "../styles/AddProduct.css";

const initialState = {
  name: "",
  category: "",
  purity: "",
  price: "",
  description: "",
  image: null,
};

export default function AddProduct() {
  const [product, setProduct] = useState(initialState);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length) {
      setProduct({ ...product, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product added:", product);
    // Integrate with backend here (e.g., send to Firebase, Node API, etc.)
    setProduct(initialState);
    setPreview(null);
  };

  return (
    <section className="add-product-container">
      <h2>Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Necklace">Necklace</option>
          <option value="Earrings">Earrings</option>
          <option value="Rings">Rings</option>
          <option value="Bracelet">Bracelet</option>
        </select>
        <select
          name="purity"
          value={product.purity}
          onChange={handleChange}
          required
        >
          <option value="">Select Purity</option>
          <option value="18K">18K</option>
          <option value="22K">22K</option>
          <option value="24K">24K</option>
          <option value="Platinum">Platinum</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={product.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          rows="4"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
        <button type="submit">Add Product</button>
      </form>
    </section>
  );
}
