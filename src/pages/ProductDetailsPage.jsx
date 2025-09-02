import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";  // import local products data
import "../styles/ProductDetailsPage.css";

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
const RatingBreakdown = ({ average, totalRatings, breakdown }) => {
  return (
    <div className="global-rating-box">
      <div className="average-rating-row">
        <div className="star-icons">
          {"★".repeat(Math.floor(average)) + "☆".repeat(5 - Math.floor(average))}
        </div>
        <div className="rating-score">
          {average.toFixed(1)} out of 5
        </div>
      </div>
      <div className="rating-total">{totalRatings.toLocaleString()} global ratings</div>

      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((star) => (
          <div className="rating-bar-row" key={star}>
            <span className="bar-label">{star} star</span>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{ width: `${breakdown[star] || 0}%` }}
              ></div>
            </div>
            <span className="bar-percent">{(breakdown[star] || 0)}%</span>
          </div>
        ))}
      </div>

      <div className="see-reviews-link">
        <a href="#reviews">See all customer reviews ›</a>
      </div>
    </div>
  );
};

  useEffect(() => {
    setLoading(true);

    const foundProduct = products.find((p) => p.id === id);

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images?.[0] || null);
    } else {
      setProduct(null);
    }

    setLoading(false);
  }, [id]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      {/* Top Section */}
      <div className="product-top-section">
        {/* Images Sidebar */}
        <div className="images-sidebar">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))
          ) : (
            <div>No images available</div>
          )}
        </div>

        {/* Main Image */}
        <div className="main-image-wrapper">
          {selectedImage ? (
            <img
              className="main-image"
              src={selectedImage}
              alt={product.name || "Product Image"}
            />
          ) : (
            <div className="no-image">No image to display</div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h2 className="product-title">{product.name || "Unnamed Product"}</h2>
          <div className="rating-orders">
            <span className="star">⭐ {product.rating ?? "N/A"}</span>
            <span className="orders">({product.orders ?? 0} orders)</span>
          </div>

          <ul className="product-meta">
            <li>
              <b>Made in:</b> {product.madeIn || "Unknown"}
            </li>
            <li>
              <b>Design:</b> {product.design || "Unknown"}
            </li>
            <li>
              <b>Delivery:</b> {product.delivery || "Unknown"}
            </li>
          </ul>

          {/* Options */}
          <div className="options-group">
            <div>
              <label className="option-label">Metal Type:</label>
              <div className="button-group">
                {product.metalTypes && product.metalTypes.length > 0 ? (
                  product.metalTypes.map((metal, idx) => (
                    <button key={idx} className="option-button">
                      {metal}
                    </button>
                  ))
                ) : (
                  <span>Not available</span>
                )}
              </div>
            </div>
            <div>
              <label className="option-label">Size:</label>
              <div className="button-group">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size, idx) => (
                    <button key={idx} className="option-button">
                      {size}
                    </button>
                  ))
                ) : (
                  <span>Not available</span>
                )}
              </div>
            </div>
            <div className="quantity-control">
              <button onClick={decrement} aria-label="Decrease quantity">
                -
              </button>
              <input type="text" value={quantity} readOnly aria-live="polite" />
              <button onClick={increment} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="price">₹{product.price ?? "N/A"}</div>
          <div className="action-buttons">
            <button className="btn-add-cart">Add to cart</button>
            <button className="btn-buy-now">Buy now</button>
          </div>

          {/* Global Rating */}
          <RatingBreakdown
  average={4.7}
  totalRatings={1399}
  breakdown={{
    5: 81,
    4: 13,
    3: 2,
    2: 1,
    1: 3,
  }}
/>

        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-section">
        <div className="tabs">
          {["description", "reviews", "company", "usage"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="tab-card">
              <p>{product.description || "No description available."}</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="reviews-list"id="reviews">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-author">{review.name}</div>
                    <div className="review-stars">{"⭐".repeat(review.rating)}</div>
                    <div className="review-text">{review.comment}</div>
                    <div className="review-text">{review.date}</div>

                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>
          )}
          {activeTab === "company" && (
            <div className="tab-card">
              <p>{product.company || "No company information available."}</p>
            </div>
          )}
          {activeTab === "usage" && (
            <div className="tab-card">
              <p>{product.usage || "No usage information available."}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products-section">
        <h3 className="related-title">Related Products</h3>
        <div className="related-products-list">
          {product.relatedProducts && product.relatedProducts.length > 0 ? (
            product.relatedProducts.map((related, idx) => (
              <div key={idx} className="related-card">
                <img src={related.image} alt={related.name} />
                <div className="related-name">{related.name}</div>
                <div className="related-price">₹{related.price}</div>
                <button className="related-cart-btn">Add to cart</button>
              </div>
            ))
          ) : (
            <p>No related products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
