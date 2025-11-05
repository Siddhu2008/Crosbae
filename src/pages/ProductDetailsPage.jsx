import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useBrand } from "../contexts/BrandContext";
import { useCertificate } from "../contexts/CertificateContext";
import useCart from "../hooks/useCart";
import Seo from "../components/Seo";
import "../styles/ProductDetailsPage.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { state: productState } = useProduct();
  const brandState = useBrand();
  const { state: certificateState } = useCertificate();
  const token = localStorage.getItem("access");
  const { addToCart } = useCart(token);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // utility to check presence of a value (not null/undefined/empty/'None'/'nan')
  const isPresent = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (!s) return false;
      if (s === "none" || s === "nan") return false;
      return true;
    }
    if (typeof v === "number") return !Number.isNaN(v);
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };

  // Load product
  useEffect(() => {
    const found = (productState.products || []).find((p) => String(p.id) === String(id));
    if (found) {
      const updatedProduct = { ...found };

      // Brand resolution
      if (updatedProduct.brand === "NA" && brandState.brands.length > 0) {
        const brandFromContext = brandState.brands.find((b) => b.id === updatedProduct.brand_id);
        updatedProduct.brand = brandFromContext ? brandFromContext.name : null;
      } else if (updatedProduct.brand === "NA") updatedProduct.brand = null;

      // Certification resolution
      if (updatedProduct.certification === "NA" && certificateState.certificates?.length > 0) {
        const certFromContext = certificateState.certificates.find(
          (c) => c.id === updatedProduct.certification_id
        );
        updatedProduct.certification = certFromContext ? certFromContext.name : null;
      } else if (updatedProduct.certification === "NA") updatedProduct.certification = null;

      setProduct(updatedProduct);
      setSelectedImage(updatedProduct.images?.[0]);
    }
    setLoading(false);
  }, [id, productState.products, brandState.brands, certificateState.certificates]);
// Scroll to top on product change
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [product]);

  // Fetch Reviews
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`https://api.crosbae.com/reviews/?product=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.results || data);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();
  }, [product]);

  // Load related products
  useEffect(() => {
    if (!product || !productState.products) return;
    setRelatedLoading(true);
    const related = productState.products.filter(
      (p) => String(p.id) !== String(product.id) && String(p.category) === String(product.category)
    );
    setRelatedProducts(related);
    setRelatedLoading(false);
  }, [product, productState.products]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-page">
      <Seo title={product.productName} description={product.description} />

      {/* Main Section */}
      <div className="product-main-section">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="thumbnail-column">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url_full || img}
                className={`thumb ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
                alt={`thumb-${i}`}
              />
            ))}
          </div>
          <div className="main-image-wrapper">
            {selectedImage && <img src={selectedImage.url_full || selectedImage} alt="main" className="main-image" />}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1 className="product-title">{product.productName || product.name}</h1>
          <p>{product.description || "No description available."}</p>

          <div className="price-block">
            <span className="price">₹ {product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="mrp">M.R.P.: ₹{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && <span className="discount">({product.discount}% off)</span>}
          </div>

          <div className="additional-attributes">
            {isPresent(product.weight) && <p><b>Weight:</b> {product.weight}</p>}
            {isPresent(product.tags) && <p><b>Tags:</b> {Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}</p>}
            {isPresent(product.certification) && <p><b>Certification:</b> {product.certification}</p>}
            {isPresent(product.brand) && <p><b>Brand:</b> {product.brand}</p>}
            {isPresent(product.hsnCode) && <p><b>HSN Code:</b> {product.hsnCode}</p>}
          </div>

          <div className="quantity-section">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="cta-buttons">
            <button onClick={() => addToCart(product, quantity)} className="btn-add-cart">
              🛒 Add to Cart
            </button>
            <Link to="/checkout" className="btn-buy-now">⚡ Buy Now</Link>
          </div>
        </div>
      </div>

      {/* Structured Table */}
      <div className="product-structured-tables">
        <h2>Product Details</h2>
        <table className="product-table">
          <tbody>
            <tr><td><b>Name:</b></td><td>{product.productName || product.name}</td></tr>
            {isPresent(product.category) && <tr><td><b>Category:</b></td><td>{product.category}</td></tr>}
            {isPresent(product.description) && <tr><td><b>Description:</b></td><td>{product.description}</td></tr>}
            {isPresent(product.metalType) && <tr><td><b>Metal Type:</b></td><td>{product.metalType}</td></tr>}
            {isPresent(product.stoneType) && <tr><td><b>Stone Type:</b></td><td>{product.stoneType}</td></tr>}
            {isPresent(product.weight) && <tr><td><b>Weight:</b></td><td>{product.weight}</td></tr>}
            {isPresent(product.size) && <tr><td><b>Size:</b></td><td>{product.size}</td></tr>}
            {isPresent(product.certification) && <tr><td><b>Certification:</b></td><td>{product.certification}</td></tr>}
            {isPresent(product.brand) && <tr><td><b>Brand:</b></td><td>{product.brand}</td></tr>}
            {isPresent(product.gstRate) && <tr><td><b>GST Rate:</b></td><td>{product.gstRate}%</td></tr>}
            {isPresent(product.features) && <tr><td><b>Features:</b></td><td>{Array.isArray(product.features) && product.features.length ? product.features.join(", ") : product.features}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.average_rating > 0 && <p><b>Rating review:</b> {product.average_rating.toFixed(1)}</p>}
          <p><b>Reviews count:</b> {reviews.length}</p>
          {reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="review-name">{rev.name || "Anonymous"}</span>
                <span className="review-stars">{"⭐".repeat(rev.rating)}</span>
              </div>
              <p>{rev.comment}</p>
              <small>{new Date(rev.date || rev.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}

      {/* Related Products */}
      {(!relatedLoading && relatedProducts.length > 0) && (
        <div className="related-products-section mt-5">
          <h2>Related Products</h2>
          <div className="related-products-grid d-flex gap-3 overflow-auto">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="related-product-card border p-2">
                <Link to={`/product/${rp.id}`} className="text-decoration-none text-dark">
                  <img
                    src={rp.images?.[0]?.url_full || rp.images?.[0] || "/fallback-image.jpg"}
                    alt={rp.productName || rp.name}
                    className="related-product-img"
                  />
                  <p className="m-0">{rp.productName || rp.name}</p>
                  <span>₹ {rp.price?.toLocaleString()}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
