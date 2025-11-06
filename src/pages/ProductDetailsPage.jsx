import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useProduct } from "../contexts/ProductContext";
import { useLoader } from "../contexts/LoaderContext";
import { useBrand } from "../contexts/BrandContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import { usePurity } from "../contexts/PurityContext";
import { useCertificate } from "../contexts/CertificateContext";
import { useCart } from "../contexts/CartContext";
import Seo from "../components/Seo";
import "../styles/ProductDetailsPage.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { state: productState } = useProduct();
  const brandState = useBrand();
  const { state: categoryState } = useCategory();
  const { state: metalState } = useMetalType();
  const { state: stoneState } = useStoneType();
  const { state: purityState } = usePurity();
  const { state: certificateState } = useCertificate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

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
  // helper to lookup a name by id/value in a context list
  const lookupName = (list, id) => {
    if (!list || id === null || id === undefined) return null;
    const strId = String(id);
    const found = list.find((it) => {
      // common id-like keys we might see from different APIs
      const idCandidates = [it.id, it.value, it.key, it.pk];
      for (const c of idCandidates) {
        if (c !== undefined && c !== null && String(c) === strId) return true;
      }
      // sometimes the stored product field already contains the name; try matching there too
      const nameCandidates = [it.name, it.label, it.value, it.metal, it.type, it.title, it.display];
      for (const n of nameCandidates) {
        if (n !== undefined && n !== null && String(n) === strId) return true;
      }
      return false;
    });
    if (!found) return null;
    // prefer common human-friendly fields in order
    return (
      found.name || found.label || found.title || found.display || found.metal || found.type || found.value || null
    );
  };

  // small helper: get first non-null field from product for various possible key names
  const extractFrom = (obj, keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  };

  useEffect(() => {
    const found = (productState.products || []).find((p) => String(p.id) === String(id));
    if (found) {
      const updatedProduct = { ...found };

      // Brand resolution
      if (brandState?.brands?.length) {
        const brandFromContext = brandState.brands.find((b) => String(b.id) === String(updatedProduct.brand) || String(b.id) === String(updatedProduct.brand_id) || String(b.name) === String(updatedProduct.brand));
        if (brandFromContext) updatedProduct.brand = brandFromContext.name;
      }
      if (updatedProduct.brand === "NA") updatedProduct.brand = null;

      // Certification resolution
      if (certificateState?.certificates?.length) {
        const certFromContext = certificateState.certificates.find((c) => String(c.id) === String(updatedProduct.certification) || String(c.id) === String(updatedProduct.certification_id) || String(c.name) === String(updatedProduct.certification));
        if (certFromContext) updatedProduct.certification = certFromContext.name;
      }
      if (updatedProduct.certification === "NA") updatedProduct.certification = null;

      // Category, metal type, stone type, purity resolution
      const originalCategoryId = updatedProduct.category_id ?? updatedProduct.category;
      const categoryName = lookupName(categoryState?.categories, originalCategoryId);
      if (categoryName) {
        updatedProduct._categoryId = originalCategoryId;
        updatedProduct.category = categoryName;
      }

      const originalMetalId = extractFrom(updatedProduct, ["metal_type_id", "metal_type", "metalType_id", "metalType", "metal"]);
      const metalName = lookupName(metalState?.metalTypes, originalMetalId);
      if (metalName) updatedProduct.metalType = metalName;
      else if (originalMetalId && !isNaN(Number(originalMetalId))) {
        // if we didn't resolve a friendly name, keep numeric id hidden by leaving metalType undefined
        delete updatedProduct.metalType;
      }

      const originalStoneId = extractFrom(updatedProduct, ["stone_type_id", "stone_type", "stoneType_id", "stoneType", "stone"]);
      const stoneName = lookupName(stoneState?.stoneTypes, originalStoneId);
      if (stoneName) updatedProduct.stoneType = stoneName;
      else if (originalStoneId && !isNaN(Number(originalStoneId))) {
        delete updatedProduct.stoneType;
      }

  const originalPurityId = extractFrom(updatedProduct, ["purity_id", "purity", "purityId"]);
  const purityName = lookupName(purityState?.purities, originalPurityId);
  if (purityName) updatedProduct.purity = purityName;

      setProduct(updatedProduct);
      setSelectedImage(updatedProduct.images?.[0]);
    }
    hideLoader();
  }, [id, productState.products, brandState.brands, certificateState.certificates, categoryState?.categories, metalState?.metalTypes, stoneState?.stoneTypes, purityState?.purities]);
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
    // Try to match by original category id where possible, otherwise by resolved name
    const productCategoryKey = product._categoryId ?? product.category;
    const related = productState.products.filter((p) => {
      if (String(p.id) === String(product.id)) return false;
      const pCatId = p.category_id ?? p.category;
      if (product._categoryId && pCatId) return String(pCatId) === String(product._categoryId);
      // fallback: compare resolved names
      const pCatName = lookupName(categoryState?.categories, p.category ?? p.category_id) || p.category;
      return String(pCatName) === String(product.category);
    });
    setRelatedProducts(related);
    setRelatedLoading(false);
  }, [product, productState.products]);

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
  <button
    className="btn-add-cart"
    onClick={async () => {
      try {
        // CartContext.addToCart expects a productId and quantity
        await addToCart(product.id ?? product._id ?? product.product_id, quantity);

        Swal.fire({
          title: "Added to Cart!",
          text: `${product.productName || product.name} has been successfully added to your cart.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Go to Cart 🛒",
          cancelButtonText: "Continue Shopping",
          reverseButtons: true,
          confirmButtonColor: "#000",
          cancelButtonColor: "#aaa",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/cart";
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to add item to cart. Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }}
  >
    🛒 Add to Cart
  </button>

  <Link to="/checkout" className="btn-buy-now">
    ⚡ Buy Now
  </Link>
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
