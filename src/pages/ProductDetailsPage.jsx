// src/pages/ProductDetailsPage.jsx
import React, { useState } from "react";
import "../styles/ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
    const addToCart = (product) => {
      const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const exists = existingCart.find((item) => item.id === product.id);

      let updatedCart;
      if (exists) {
        updatedCart = existingCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

  const product = {
    name: "Elegant Gold Plated Necklace Set",
    sku: "SKU-001",
    price: 2499,
    originalPrice: 3999,
    discount: "38% OFF",
    rating: 4.5,
    reviews: 128,
    stock: 25,
    delivery: "FREE delivery by Tomorrow, 9 AM",
    offers: [
      "Bank Offer: 10% Instant Discount on HDFC Bank Cards",
      "Get ₹500 off on your first purchase",
      "No Cost EMI available on select cards",
    ],
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",
    ],
    features: [
      "Premium gold plating",
      "Anti-tarnish coating",
      "Hypoallergenic materials",
      "Traditional craftsmanship",
      "Complete jewelry set",
    ],
    details: {
      Material: "Brass with gold plating",
      Plating: "18K gold plated",
      Weight: "150 grams",
      "Chain Length": "16-18 inches adjustable",
      "Earring Type": "Drop earrings",
      Occasion: "Wedding, Festival, Party",
    },
    description:
      "This exquisite necklace set is perfect for weddings, festivals, and special occasions. Intricate design crafted with attention to detail.",
  };

  return (
    <div className="product-page" style={{ paddingTop: "120px" }}>
      {/* LEFT IMAGES */}
      <div className="product-images">
        <div className="main-image">
          <img src={product.images[selectedImage]} alt="main" />
          <span className="discount-badge">{product.discount}</span>
        </div>
        <div className="thumbnail-list">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumbnail"
              className={`thumbnail ${selectedImage === index ? "active" : ""}`}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT INFO */}
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="sku">SKU: {product.sku}</p>

        <div className="rating">
          ⭐ {product.rating} ({product.reviews} reviews)
        </div>

        <div className="price-section">
          <span className="price">₹{product.price.toLocaleString()}</span>
          <span className="original-price">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>

        <div className="stock">
          {product.stock > 0 ? (
            <span className="in-stock">✔ {product.stock} in stock</span>
          ) : (
            <span className="out-stock">Out of Stock</span>
          )}
        </div>

        <div className="offers">
          <h4>Available offers</h4>
          <ul>
            {product.offers.map((offer, i) => (
              <li key={i}>✔ {offer}</li>
            ))}
          </ul>
        </div>

        <div className="delivery">{product.delivery}</div>

        <div className="features">
          <h4>Key Features</h4>
          <ul>
            {product.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>

        <div className="description">
          <h4>About this item</h4>
          <p>{product.description}</p>
        </div>

        <div className="action-buttons">
          <button className="add-cart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          <button className="buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
