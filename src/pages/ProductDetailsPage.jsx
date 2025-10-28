import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useBrand } from "../contexts/BrandContext";
import { useCertificate } from "../contexts/CertificateContext";
import { useCart } from "../contexts/CartContext";
import Seo from "../components/Seo";
import "../styles/ProductDetailsPage.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { state: productState } = useProduct();
  const { state: brandState } = useBrand();
  const { state: certificateState } = useCertificate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

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
            {product.weight && <p><b>Weight:</b> {product.weight}</p>}
            {product.tags && <p><b>Tags:</b> {Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}</p>}
            {product.certification && <p><b>Certification:</b> {product.certification}</p>}
            {product.brand && <p><b>Brand:</b> {product.brand}</p>}
            {product.hsnCode && <p><b>HSN Code:</b> {product.hsnCode}</p>}
          </div>

          <div className="quantity-section">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="cta-buttons">
            <button
              onClick={async () => {
                if (!addToCart) {
                  window.location.href = "/login";
                  return;
                }
                try {
                  setAdding(true);
                  // use CartContext's addToCart signature (productId, quantity)
                  await addToCart(product.id, quantity);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 1800);
                } catch (e) {
                  // errors handled by CartContext / addToCart
                } finally {
                  setAdding(false);
                }
              }}
              className={`btn-add-cart ${justAdded ? 'added' : ''}`}
              disabled={adding}
            >
              {adding ? (
                <>🔄 <span>Adding...</span></>
              ) : justAdded ? (
                <>✅ <span>Added</span></>
              ) : (
                <>🛒 <span>Add to Cart</span></>
              )}
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
            <tr><td><b>Category:</b></td><td>{product.category || "N/A"}</td></tr>
            <tr><td><b>Description:</b></td><td>{product.description || "No description available."}</td></tr>
            <tr><td><b>Metal Type:</b></td><td>{product.metalType || "N/A"}</td></tr>
            <tr><td><b>Stone Type:</b></td><td>{product.stoneType || "N/A"}</td></tr>
            <tr><td><b>Weight:</b></td><td>{product.weight || "N/A"}</td></tr>
            <tr><td><b>Size:</b></td><td>{product.size || "N/A"}</td></tr>
            {product.certification && <tr><td><b>Certification:</b></td><td>{product.certification}</td></tr>}
            {product.brand && <tr><td><b>Brand:</b></td><td>{product.brand}</td></tr>}
            <tr><td><b>GST Rate:</b></td><td>{product.gstRate || "5"}%</td></tr>
            <tr><td><b>Features:</b></td><td>{Array.isArray(product.features) && product.features.length ? product.features.join(", ") : "None"}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.average_rating > 0 && <p><b>Rating review:</b> {product.average_rating.toFixed(1)}</p>}
        <p><b>Reviews count:</b> {reviews.length}</p>
        {reviews.length ? reviews.map((rev, i) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <span className="review-name">{rev.name || "Anonymous"}</span>
              <span className="review-stars">{"⭐".repeat(rev.rating)}</span>
            </div>
            <p>{rev.comment}</p>
            <small>{new Date(rev.date || rev.created_at).toLocaleDateString()}</small>
          </div>
        )) : <p>No reviews yet.</p>}
      </div>

      {/* Related Products */}
      <div className="related-products-section mt-5">
        <h2>Related Products</h2>
        {relatedLoading ? (
          <div className="loader">Loading Related Products...</div>
        ) : relatedProducts.length ? (
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
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
}
