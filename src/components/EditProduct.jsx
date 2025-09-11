import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

export default function EditProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "Gold Necklace",
    category: "Necklace",
    purity: "22K",
    price: "25000",
    quantity: "10",
    description: "Elegant handcrafted gold necklace.",
    images: [
      "https://example.com/images/gold-necklace1.jpg",
      "https://example.com/images/gold-necklace2.jpg",
    ],
    newImages: [],
  });

  const [previews, setPreviews] = useState([...product.images]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "newImages" && files.length) {
      const filesArray = Array.from(files);
      setProduct((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...filesArray],
      }));

      const filePreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...filePreviews]);
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    if (index < product.images.length) {
      // remove existing image
      const updatedImages = product.images.filter((_, i) => i !== index);
      setProduct((prev) => ({ ...prev, images: updatedImages }));
    } else {
      // remove newly uploaded image
      const newIndex = index - product.images.length;
      const updatedNewImages = product.newImages.filter(
        (_, i) => i !== newIndex
      );
      setProduct((prev) => ({ ...prev, newImages: updatedNewImages }));
    }

    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };

  const handleSave = () => {
    alert("Product updated successfully!");
    console.log("Updated Product Data:", product);
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
      <div className="form-card" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Edit Product</h2>

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
          <option value="Ring">Ring</option>
          <option value="Bracelet">Bracelet</option>
          <option value="Earrings">Earrings</option>
        </select>

        <select
          name="purity"
          value={product.purity}
          onChange={handleChange}
          required
        >
          <option value="">Select Purity</option>
          <option value="22K">22K</option>
          <option value="18K">18K</option>
          <option value="14K">14K</option>
          <option value="Platinum">Platinum</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={product.price}
          onChange={handleChange}
          required
          min="0"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          required
          min="0"
        />

        <textarea
          name="description"
          placeholder="Product Description"
          rows="4"
          value={product.description}
          onChange={handleChange}
          required
        />

        <label>Existing & New Images</label>
        <div className="thumbnails">
          {previews.map((src, index) => (
            <div key={index} className="thumb-wrapper">
              <img src={src} alt={`Preview ${index + 1}`} className="thumb" />
              <button
                type="button"
                className="remove-thumb-btn"
                onClick={() => removeImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <label className="image-upload-label">
          Upload New Images
          <input
            type="file"
            name="newImages"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="image-upload-input"
          />
        </label>

        <button
          className="save-btn"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Save Changes
        </button>
        <button className="cancel-btn" onClick={() => navigate("/admin")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
