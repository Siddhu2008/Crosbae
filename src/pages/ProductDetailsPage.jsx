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
import { useAuth } from "../contexts/AuthContext";
import Seo from "../components/Seo";
import "../styles/ProductDetailsPage.css";
import { useReview } from "../contexts/ReviewContext";

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
  const { user } = useAuth();
  const { hideLoader } = useLoader();
  const { fetchReviews, postReview } = useReview();
  const [rating, setRating] = useState(0);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // utility to check presence
  const isPresent = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (!s || s === "none" || s === "nan") return false;
      return true;
    }
    if (typeof v === "number") return !Number.isNaN(v);
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };

  // helper to lookup a name by id/value in a context list
  const lookupName = (list, id, nameField = "name") => {
    if (!list || id === null || id === undefined) return null;
    const strId = String(id);
    const found = list.find(
      (it) =>
        String(it.id) === strId ||
        String(it.value) === strId ||
        String(it.key) === strId ||
        String(it.pk) === strId ||
        String(it[nameField]) === strId
    );
    if (!found) return null;
    return (
      found[nameField] ||
      found.name ||
      found.label ||
      found.title ||
      found.display ||
      found.metal_name ||
      found.stone_name ||
      null
    );
  };

  // normalize reviews into an array
  const normalizeReviews = (r) => {
    if (Array.isArray(r)) return r;
    if (!r) return [];
    if (r.results && Array.isArray(r.results)) return r.results;
    if (typeof r === "object") return [r];
    return [];
  };

  // small helper: get first non-null field from product for various possible key names
  const extractFrom = (obj, keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  };

  // Load Product
  useEffect(() => {
    const found = (productState.products || []).find(
      (p) => String(p.id) === String(id)
    );
    console.log("Found product:", found);
    if (found) {
      const updatedProduct = { ...found };

      // ✅ Brand
      if (brandState?.brands?.length) {
        const brand = brandState.brands.find(
          (b) =>
            String(b.id) === String(updatedProduct.brand) ||
            String(b.name) === String(updatedProduct.brand)
        );
        if (brand) updatedProduct.brand = brand.name;
      }

      // ✅ Certificate
      if (certificateState?.certificates?.length) {
        const cert = certificateState.certificates.find(
          (c) =>
            String(c.id) === String(updatedProduct.certification) ||
            String(c.name) === String(updatedProduct.certification)
        );
        if (cert) updatedProduct.certification = cert.name;
      }

      // ✅ Category
      const catId = updatedProduct.category_id ?? updatedProduct.category;
      const catName = lookupName(categoryState?.categories, catId);
      if (catName) {
        updatedProduct._categoryId = catId;
        updatedProduct.category = catName;
      }

      // ✅ Metal
      const metalId = extractFrom(updatedProduct, [
        "metal_type_id",
        "metal_type",
        "metalType",
      ]);
      const metalName = lookupName(metalState?.metalTypes, metalId, "metal_name");
      if (metalName) updatedProduct.metalType = metalName;

      // ✅ Stone
      const stoneId = extractFrom(updatedProduct, [
        "stone_type_id",
        "stone_type",
        "stoneType",
      ]);
      const stoneName = lookupName(stoneState?.stoneTypes, stoneId, "stone_name");
      if (stoneName) updatedProduct.stoneType = stoneName;

      // ✅ Purity
      const purityId = extractFrom(updatedProduct, [
        "purity_id",
        "purity",
        "purityId",
      ]);
      const purityName = lookupName(purityState?.purities, purityId, "name");
      if (purityName) updatedProduct.purity = purityName;

      // ✅ Reviews directly from product (normalize)
      setReviews(normalizeReviews(updatedProduct.reviews));

      setProduct(updatedProduct);
      setSelectedImage(updatedProduct.images?.[0]);
    }
    hideLoader();
  }, [
    id,
    productState.products,
    brandState.brands,
    certificateState.certificates,
    categoryState?.categories,
    metalState?.metalTypes,
    stoneState?.stoneTypes,
    purityState?.purities,
  ]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const loadReviews = async () => {
      const data = await fetchReviews(product.id);
      setReviews(normalizeReviews(data));
    };
    loadReviews();
  }, [product]);

  // Related Products
  useEffect(() => {
    if (!product || !productState.products) return;
    setRelatedLoading(true);
    const related = productState.products.filter((p) => {
      if (String(p.id) === String(product.id)) return false;
      const pCatId = p.category_id ?? p.category;
      if (product._categoryId && pCatId)
        return String(pCatId) === String(product._categoryId);
      const pCatName =
        lookupName(categoryState?.categories, p.category ?? p.category_id) ||
        p.category;
      return String(pCatName) === String(product.category);
    });
    setRelatedProducts(related);
    setRelatedLoading(false);
  }, [product, productState.products]);

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-page">
      <Seo title={product.name} description={product.description} />

      {/* Main Section */}
      <div className="product-main-section">
        {/* Gallery */}
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
            {selectedImage && (
              <img
                src={selectedImage.url_full || selectedImage}
                alt="main"
                className="main-image"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <p>{product.description}</p>

          <div className="price-block">
            <span className="price">₹ {product.price?.toLocaleString()}</span>
            {product.discount && (
              <span className="discount">({product.discount}% OFF)</span>
            )}
          </div>

          <div className="additional-attributes">
            {isPresent(product.weight) && (
              <p>
                <b>Weight:</b> {product.weight}g
              </p>
            )}
            {isPresent(product.size) && (
              <p>
                <b>Size:</b> {product.size}
              </p>
            )}
            {isPresent(product.metalType) && (
              <p>
                <b>Metal Type:</b> {product.metalType}
              </p>
            )}
            {isPresent(product.stoneType) && (
              <p>
                <b>Stone Type:</b> {product.stoneType}
              </p>
            )}
            {isPresent(product.purity) && (
              <p>
                <b>Purity:</b> {product.purity}
              </p>
            )}
            {isPresent(product.certification) && (
              <p>
                <b>Certification:</b> {product.certification}
              </p>
            )}
            {isPresent(product.brand) && (
              <p>
                <b>Brand:</b> {product.brand}
              </p>
            )}
            {isPresent(product.hsn_code) && (
              <p>
                <b>HSN Code:</b> {product.hsn_code}
              </p>
            )}
            {isPresent(product.tags) && (
              <p>
                <b>Tags:</b> {product.tags}
              </p>
            )}
          </div>

          <div className="quantity-section">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="cta-buttons">
            <button
              className="btn-add-cart"
              onClick={async () => {
                try {
                  await addToCart(product.id, quantity);
                  Swal.fire({
                    title: "Added to Cart!",
                    text: `${product.name} added successfully.`,
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "Go to Cart 🛒",
                    cancelButtonText: "Continue Shopping",
                    reverseButtons: true,
                  }).then((res) => {
                    if (res.isConfirmed) window.location.href = "/cart";
                  });
                } catch {
                  Swal.fire("Error", "Failed to add to cart", "error");
                }
              }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn-buy-now"
              onClick={() => {
                addToCart(product.id, quantity);
                window.location.href = "/cart";
              }}
            >
              ⚡ Buy Now
            </button>

          </div>
        </div>
      </div>

      {/* Structured Details */}
      <div className="product-structured-tables">
        <h2>Product Details</h2>
        <table className="product-table">
          <tbody>
            <tr>
              <td><b>Name:</b></td>
              <td>{product.name}</td>
            </tr>
            {isPresent(product.category) && (
              <tr><td><b>Category:</b></td><td>{product.category}</td></tr>
            )}
            {isPresent(product.metalType) && (
              <tr><td><b>Metal Type:</b></td><td>{product.metalType}</td></tr>
            )}
            {isPresent(product.stoneType) && (
              <tr><td><b>Stone Type:</b></td><td>{product.stoneType}</td></tr>
            )}
            {isPresent(product.purity) && (
              <tr><td><b>Purity:</b></td><td>{product.purity}</td></tr>
            )}
            {isPresent(product.weight) && (
              <tr><td><b>Weight:</b></td><td>{product.weight}</td></tr>
            )}
            {isPresent(product.size) && (
              <tr><td><b>Size:</b></td><td>{product.size}</td></tr>
            )}
            {isPresent(product.brand) && (
              <tr><td><b>Brand:</b></td><td>{product.brand}</td></tr>
            )}
            {isPresent(product.certification) && (
              <tr><td><b>Certification:</b></td><td>{product.certification}</td></tr>
            )}
            {isPresent(product.hsn_code) && (
              <tr><td><b>HSN code:</b></td><td>{product.hsn_code}</td></tr>
            )}
            {isPresent(product.tags) && (
              <tr><td><b>Tags:</b></td><td>{product.tags}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =======================
          CUSTOMER REVIEWS SECTION (with modal form)
          ======================= */}
      <div className="customer-reviews-section">
        <h2>Customer Reviews</h2>

        {(() => {
          if (reviews.length === 0)
            return (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-write-review"
                >
                  ✍️ Write a Review
                </button>
              </div>
            );

          // Calculate average
          const total = reviews.reduce((a, b) => a + (b.rating || 0), 0);
          const averageRating = reviews.length > 0 ? total / reviews.length : 0;

          // Sort & slice top 5
          const sortedReviews = [...reviews].sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return new Date(b.date) - new Date(a.date);
          });
          const topReviews = sortedReviews.slice(0, 5);

          return (
            <>
              {/* Overview box */}
              <div className="review-overview-box">
                <div className="overview-top">
                  <div className="average-score">
                    <h1>{averageRating.toFixed(1)}</h1>
                    <p>out of 5</p>
                    <div className="stars">
                      {"★".repeat(Math.round(averageRating))}
                      {"☆".repeat(5 - Math.round(averageRating))}
                    </div>
                    <small>{reviews.length} global ratings</small>
                  </div>

                  <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const percent =
                        reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="rating-row">
                          <span>{star} star</span>
                          <div className="bar">
                            <div
                              className="fill"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="customer-summary">
                  <h4>Customers say</h4>
                  <p>
                    Customers love this product for its quality and value. A few
                    mentioned improvements in design or delivery, but overall
                    satisfaction is high.
                  </p>
                </div>
              </div>

              {/* Write Review Button */}
              <div className="review-button">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-write-review"
                >
                  ✍️ Write a Review
                </button>
              </div>

              {/* Top 5 Reviews */}
              <div className="reviews-list">
                {topReviews.map((rev, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div>
                        <strong>{rev.name || "Anonymous"}</strong>
                        <div className="review-stars">
                          {"★".repeat(rev.rating || 0)}
                          {"☆".repeat(5 - (rev.rating || 0))}
                        </div>
                      </div>
                      <span className="review-date">
                        {rev.date
                          ? new Date(rev.date).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <p className="review-text">{rev.comment}</p>

                    {rev.media && rev.media.length > 0 && (
                      <div className="review-media-grid">
                        {rev.media.map((m, idx) => (
                          <div
                            key={idx}
                            className="review-media-item"
                            onClick={() => setSelectedMedia(m)}
                          >
                            {m.type === "image" ? (
                              <img
                                src={m.preview || m.url || m.file}
                                alt={`review-media-${idx}`}
                                loading="lazy"
                              />
                            ) : (
                              <video
                                src={m.preview || m.url || m.file}
                                muted
                                preload="metadata"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {/* =======================
            REVIEW FORM MODAL DIALOG
            ======================= */}
        {showReviewForm && (
          <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <h3>Write a Review</h3>
              <form
                className="review-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newReview = {
                    title: formData.get("title"),
                    customer: formData.get("customer"),
                    name: formData.get("customer"), // backward compatibility
                    rating: parseInt(formData.get("rating")),
                    comment: formData.get("review") || formData.get("comment"),
                    review: formData.get("review") || formData.get("comment"),
                    media: Array.from(e.target.media.files).map((file) => ({
                      file,
                      type: file.type.startsWith("video") ? "video" : "image",
                    })),
                  };

                  if (!newReview.customer || !newReview.rating || !newReview.comment || !newReview.title) {
                    Swal.fire("Missing Fields", "Please fill all fields (title, name, rating, review).", "warning");
                    return;
                  }

                  try {
                    const savedReview = await postReview(product.id, newReview);
                    setReviews((prev) => [...prev, savedReview]);
                    e.target.reset();
                    setPreviewFiles([]);
                    setRating(0);
                    setShowReviewForm(false);

                    Swal.fire({
                      title: "Thank You!",
                      text: "Your review has been submitted successfully.",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  } catch {
                    Swal.fire("Error", "Failed to submit review", "error");
                  }
                }}
              >
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" placeholder="Short summary (e.g. Great quality)" required />
                </div>

                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="customer"
                    placeholder="Your name"
                    defaultValue={
                      user?.full_name || user?.name || user?.first_name || user?.username || ""
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <span
                        key={r}
                        className={`star ${r <= rating ? "filled" : ""}`}
                        onClick={() => setRating(r)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <input type="hidden" name="rating" value={rating} required />
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea name="review" rows="4" required></textarea>
                </div>

                <div className="form-group">
                  <label>Upload Images or Videos</label>
                  <input
                    type="file"
                    name="media"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files).map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                        type: file.type.startsWith("video") ? "video" : "image",
                      }));
                      setPreviewFiles(files);
                    }}
                  />
                  {previewFiles.length > 0 && (
                    <div className="preview-grid">
                      {previewFiles.map((media, i) => (
                        <div key={i} className="preview-item">
                          {media.type === "image" ? (
                            <img src={media.preview} alt={`preview-${i}`} />
                          ) : (
                            <video src={media.preview} controls />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-buttons">
                  <button type="button" className="btn-cancel" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-review">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MEDIA LIGHTBOX */}
        {selectedMedia && (
          <div className="lightbox-overlay" onClick={() => setSelectedMedia(null)}>
            <div className="lightbox-content">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.preview || selectedMedia.url}
                  alt="enlarged-media"
                />
              ) : (
                <video
                  src={selectedMedia.preview || selectedMedia.url}
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        )}
      </div>


      {/* Related Products */}
      {!relatedLoading && relatedProducts.length > 0 && (
        <div className="related-products-section mt-5">
          <h2>Related Products</h2>
          <div className="related-products-grid d-flex gap-3 overflow-auto">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="related-product-card border p-2">
                <Link
                  to={`/product/${rp.id}`}
                  className="text-decoration-none text-dark"
                >
                  <img
                    src={
                      rp.images?.[0]?.url_full || rp.images?.[0] || "/fallback.jpg"
                    }
                    alt={rp.name}
                    className="related-product-img"
                  />
                  <p className="m-0">{rp.name}</p>
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
