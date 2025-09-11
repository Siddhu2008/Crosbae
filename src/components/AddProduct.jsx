import React, { useState } from "react";
import "../styles/AddProduct.css";

const initialState = {
  name: "",
  category: "",
  purity: "",
  price: "",
  quantity: "",
  description: "",
  images: [],
};

export default function AddProduct() {
  const [product, setProduct] = useState(initialState);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images" && files.length) {
      const filesArray = Array.from(files);
      setProduct({ ...product, images: filesArray });

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const removeImage = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product added:", product);
    // Here you can integrate API to save product
    setProduct(initialState);
    setPreviews([]);
  };

  return (
    <section className="add-product-container">
      <h2>Add New Product</h2>
      <div className="product-form-wrapper">
        <div className="image-section">
          {/* Main preview */}
          {previews[0] ? (
            <img src={previews[0]} alt="Main Preview" className="main-image" />
          ) : (
            <div className="main-image placeholder">Main Image Preview</div>
          )}

          {/* Thumbnails */}
          {previews.length > 0 && (
            <div className="thumbnails">
              {previews.map((src, index) => (
                <div key={index} className="thumb-wrapper">
                  <img
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumb"
                  />
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
          )}

          <label className="image-upload-label">
            Click or Drag Images Here
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="image-upload-input"
            />
          </label>
        </div>

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
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity}
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
          <button type="submit">Save Product</button>
        </form>
      </div>
    </section>
  );
}
