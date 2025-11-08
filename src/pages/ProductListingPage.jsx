import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // 👈 add this import at the top
import { useProduct } from "../contexts/ProductContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import { usePurity } from "../contexts/PurityContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import Seo from "../components/Seo";
import "../styles/ProductListingPage.css";

export default function ProductListingPage() {
  const [filters, setFilters] = useState({
    category: [],
    purity: [],
    occasion: [],
    metalType: [],
    stoneType: [],
    search: "",
  });
  const [sortOption, setSortOption] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { state } = useProduct();
  const productsList = state?.products || [];
  const _loading = state?.loading; // local loader flag (unused here)

  const { state: categoryState } = useCategory();
  const categories = categoryState?.categories || [];
  const { state: metalState } = useMetalType();
  const _metalTypes = metalState?.metalTypes || [];
  const { state: stoneState } = useStoneType();
  const _stoneTypes = stoneState?.stoneTypes || [];
  const { state: purityState } = usePurity();
  const purities = purityState?.purities || [];
  const location = useLocation();

  const { wishlistProductIds, toggleWishlist } = useWishlist();

  const { addToCart } = useCart();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryQuery = query.get("category");

  const toggleFilterSidebar = () => setShowFilter(!showFilter);

  const getTagStyle = (tag) => {
    // Return background and CSS variables for main/sub text colors so
    // we can style first and second lines differently while still
    // allowing per-tag text colors.
    switch (tag) {
      case "NEW":
        return {
          background: "linear-gradient(to right, #00c9a7, #92fe9d)",
          "--tag-main-color": "#ffffff",
          "--tag-sub-color": "rgba(255,255,255,0.9)",
        };
      case "Flat 50% OFF":
        return {
          background: "linear-gradient(to right, #e52d27, #b31217)",
          "--tag-main-color": "#ffffff",
          "--tag-sub-color": "rgba(255,255,255,0.9)",
        };
      case "Best Seller":
        return {
          background: "linear-gradient(to right, #f7971e, #ffd200)",
          "--tag-main-color": "#111111",
          "--tag-sub-color": "rgba(0,0,0,0.75)",
        };
      default:
        return {
          background: "linear-gradient(to right, #bfa17f, #f5e6ca)",
          "--tag-main-color": "#ffffff",
          "--tag-sub-color": "rgba(255,255,255,0.95)",
        };
    }
  };

  // Format tag for display: show only first two words on line1; allow at most one extra line from comma-separated parts.
  // Limit to first two tag elements overall when rendering.
  const formatTagDisplay = (tag) => {
    if (tag === null || tag === undefined) return { left: "", right: null };
    const str = String(tag).trim();
    if (!str) return { left: "", right: null };

    // split by comma into parts, but only keep up to two parts
    const parts = str.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2);

    // left: take up to first two words of first part
    const first = parts[0] || "";
    const words = first.split(/\s+/).filter(Boolean);
    let left = words.slice(0, 2).join(" ");
    if (words.length > 2) left += "...";

    // right: second comma part if present, trimmed and truncated to 40 chars
    let right = parts[1] || null;
    if (right && right.length > 40) right = right.slice(0, 37) + "...";

    return { left, right };
  };

  const [productsWithImages, setProductsWithImages] = useState([]);
  useEffect(() => {
    if (productsList.length > 0) {
      const updatedProducts = productsList.map((product) => {
        let images = [];
        if (Array.isArray(product.images)) {
          images = product.images.map(
            (img) => (typeof img === "string" ? img : img.url_full || img.url || "/fallback-image.jpg")
          );
        }
        // Normalize common field names so filters work regardless of API shape
        const normalized = {
          ...product,
          images: images.length ? images : ["/fallback-image.jpg"],
          // category can be named differently in various endpoints
          category: product.category ?? product.category_id ?? product._categoryId ?? product.categoryId,
          // metal and stone types may differ in naming
          metalType: product.metalType ?? product.metal_type ?? product.metal_type_id ?? product.metal_typeId,
          stoneType: product.stoneType ?? product.stone_type ?? product.stone_type_id ?? product.stone_typeId,
          // purity variations
          purity: product.purity ?? product.purity_level ?? product.purityId,
          // tags may be a comma-separated string or array
          tags: Array.isArray(product.tags)
            ? product.tags
            : typeof product.tags === "string"
            ? product.tags.split(",").map((s) => s.trim()).filter(Boolean)
            : product.tags
        };

        // ensure name fields exist consistently
        if (!normalized.productName && (normalized.name || normalized.title)) {
          normalized.productName = normalized.name || normalized.title;
        }

        return normalized;
      });
      setProductsWithImages(updatedProducts);
    } else setProductsWithImages([]);
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    let result = [...productsWithImages];
    if (filters.search) result = result.filter((p) => p.name?.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.category.length) result = result.filter((p) => filters.category.includes(String(p.category)));
    if (filters.purity.length) result = result.filter((p) => filters.purity.includes(String(p.purity)));
    if (filters.metalType.length) result = result.filter(
      (p) => (p.metalType ?? p.metal_type) && filters.metalType.includes(String(p.metalType ?? p.metal_type))
    );
    if (filters.stoneType.length) result = result.filter(
      (p) => (p.stoneType ?? p.stone_type) && filters.stoneType.includes(String(p.stoneType ?? p.stone_type))
    );
    if (filters.occasion.length) result = result.filter((p) => filters.occasion.includes(p.occasion));
    // support tag-based filtering if implemented (tags in filter sidebar)
    if (filters.tags && filters.tags.length) {
      result = result.filter((p) => {
        const tags = Array.isArray(p.tags) ? p.tags.map(String) : [];
        return filters.tags.some((t) => tags.includes(String(t)));
      });
    }
    if (sortOption === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "priceHighLow") result.sort((a, b) => b.price - a.price);
    else if (sortOption === "newest") result.sort((a, b) => new Date(b.date) - new Date(a.date));
    return result;
  }, [filters, sortOption, productsWithImages]);

  const { matchedProducts, otherProducts } = useMemo(() => {
    if (!categoryQuery) return { matchedProducts: [], otherProducts: filteredProducts };
    const matched = filteredProducts.filter((p) => String(p.category) === String(categoryQuery));
    const others = filteredProducts.filter((p) => String(p.category) !== String(categoryQuery));
    return { matchedProducts: matched, otherProducts: others };
  }, [filteredProducts, categoryQuery]);

  const totalPages = Math.ceil(otherProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return otherProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [otherProducts, currentPage]);

  useEffect(() => setCurrentPage(1), [filters, sortOption]);

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const updatedValues = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];
    setFilters((prev) => ({ ...prev, [type]: updatedValues }));
  };

  const handleSearchChange = (e) => setFilters((prev) => ({ ...prev, search: e.target.value }));

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // ✅ Loader JSX
  const Loader = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="Product-container position-relative my-5">
      <Seo
        title="Shop All Jewellery"
        description="Explore our wide range of stunning imitation jewellery."
        keywords="shop jewellery, rings, necklaces, artificial jewellery"
      />

      {/* Filter + Sort */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary filter" onClick={toggleFilterSidebar}>
          <i className="bi bi-funnel-fill"></i> Filters
        </button>
        <div className="sort-box ms-auto">
          <label className="lable-sort fw-semibold">Sort By:</label>
          <select
            className="form-select w-auto shadow-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Relevance</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Sidebar Filter */}
      <div className={`filter-drawer bg-white shadow-lg position-fixedh-100 ${showFilter ? "start-0" : "start-100"}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 ">Filters</h5>
          <button className="btn-close" onClick={toggleFilterSidebar}></button>
        </div>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search..."
          value={filters.search}
          onChange={handleSearchChange}
        />

        {/* Category */}
        <div className="mb-4">
          <h6>Category</h6>
          {(categories || []).map((cat) => (
            <div key={cat.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={String(cat.id)}
                id={`cat-${cat.id}`}
                checked={filters.category.includes(String(cat.id))}
                onChange={(e) => handleCheckboxChange(e, "category")}
              />
              <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                {cat.name}
              </label>
            </div>
          ))}
        </div>

        {/* Purity */}
        <div className="mb-4">
          <h6>Purity</h6>
          {(purities || []).map((pur) => {
            const val = pur.id ?? pur.name ?? pur.value ?? String(pur);
            const label = pur.name || pur.label || String(pur);
            return (
              <div key={val} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={String(val)}
                  id={`purity-${val}`}
                  checked={filters.purity.includes(String(val))}
                  onChange={(e) => handleCheckboxChange(e, "purity")}
                />
                <label className="form-check-label" htmlFor={`purity-${val}`}>
                  {label}
                </label>
              </div>
            );
          })}
        </div>

       {/* Metal Type */}
<div className="mb-4">
  <h6>Metal Type</h6>
  {( _metalTypes || [] ).map((m) => {
    // ✅ use backend field names properly
    const val = m.id ?? m.metal_name ?? m.value ?? String(m);
    const label = m.metal_name || m.name || m.label || String(m);

    return (
      <div key={val} className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={String(val)}
          id={`metal-${val}`}
          checked={filters.metalType.includes(String(val))}
          onChange={(e) => handleCheckboxChange(e, "metalType")}
        />
        <label className="form-check-label" htmlFor={`metal-${val}`}>
          {label}
        </label>
      </div>
    );
  })}
</div>

{/* Stone Type */}
<div className="mb-4">
  <h6>Stone Type</h6>
  {( _stoneTypes || [] ).map((s) => {
    // ✅ use backend field names properly
    const val = s.id ?? s.stone_name ?? s.value ?? String(s);
    const label = s.stone_name || s.name || s.label || String(s);

    return (
      <div key={val} className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={String(val)}
          id={`stone-${val}`}
          checked={filters.stoneType.includes(String(val))}
          onChange={(e) => handleCheckboxChange(e, "stoneType")}
        />
        <label className="form-check-label" htmlFor={`stone-${val}`}>
          {label}
        </label>
      </div>
    );
  })}
</div>


        {/* Apply & Clear */}
        <div className="border-top p-3 d-flex justify-content-between">
          <button
            className="btn btn-outline-danger"
            onClick={() =>
              setFilters({ category: [], purity: [], occasion: [], metalType: [], stoneType: [], search: "" })
            }
          >
            Clear
          </button>
          <button className="btn btn-dark" onClick={toggleFilterSidebar}>
            Apply
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showFilter && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={toggleFilterSidebar}
        ></div>
      )}

      {/* Product Grid */}
      <div className="product-listing-page">
          <div className="product-grid">
            {[...matchedProducts, ...paginatedProducts].map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-image-section">
                  {p.tags?.length > 0 && (
                    <div className="product-tags">
                      {(Array.isArray(p.tags) ? p.tags : [p.tags]).slice(0, 2).map((tag, i) => {
                        const { left, right } = formatTagDisplay(tag);
                        return (
                          <span key={i} className="product-tag" style={getTagStyle(tag)}>
                            {left}
                            {right && (
                              <>
                                <br />
                                <span className="tag-sub">{right}</span>
                              </>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <button
                    className={`like-btn ${wishlistProductIds?.[p.id] ? "liked" : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();

                      const token = localStorage.getItem("access");
                      if (!token) {
                        Swal.fire({
                          title: "Login Required!",
                          text: "Please log in to manage your wishlist.",
                          icon: "warning",
                          confirmButtonText: "Go to Login",
                        }).then(() => {
                          window.location.href = "/login";
                        });
                        return;
                      }

                      try {
                        const isLiked = wishlistProductIds?.[p.id];
                        await toggleWishlist(p);

                        if (isLiked) {
                          Swal.fire({
                            title: "Removed from Wishlist",
                            text: `${p.name || p.productName} has been removed from your wishlist.`,
                            icon: "info",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        } else {
                          Swal.fire({
                            title: "Added to Wishlist 💖",
                            text: `${p.name || p.productName} has been added to your wishlist.`,
                            icon: "success",
                            showCancelButton: true,
                            confirmButtonText: "Go to Wishlist",
                            cancelButtonText: "Continue Shopping",
                            reverseButtons: true,
                            confirmButtonColor: "#000",
                            cancelButtonColor: "#aaa",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.href = "/wishlist";
                            }
                          });
                        }
                      } catch (error) {
                        console.error(error);
                        Swal.fire({
                          title: "Error!",
                          text: "Something went wrong. Please try again.",
                          icon: "error",
                          confirmButtonText: "Okay",
                        });
                      }
                    }}
                  >
                    ♥
                  </button>

                  <Link to={`/product/${p.id}`} className="product-image-link">
                    <img
                      src={
                        typeof p.images?.[0] === "string"
                          ? p.images[0]
                          : p.images?.[0]?.url_full || p.images?.[0]?.url || "/fallback-image.jpg"
                      }
                      alt={p.name || p.productName}
                      className="product-image"
                    />
                  </Link>
                </div>
                <div className="product-list-info">
                  <Link to={`/product/${p.id}`} className="text-decoration-none">
                    <h6 className="product-cart-title">{p.productName || p.name}</h6>
                    <p className="product-desc">
                      {(p.description || "").split(" ").slice(0, 8).join(" ")}
                      {(p.description || "").split(" ").length > 8 ? "..." : ""}
                    </p>
                    <span className="product-price">₹ {p.price}</span>
                  </Link>
                  <div className="product-bottom-row">
                    <button
                      className="cart-btn"
                      onClick={async () => {
                        if (!addToCart) {
                          window.location.href = "/login";
                          return;
                        }

                        try {
                          await addToCart(p.id);

                          Swal.fire({
                            title: "Added to Cart!",
                            text: `${p.productName || p.name} has been successfully added to your cart.`,
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
                          console.error(error);
                          Swal.fire({
                            title: "Error!",
                            text: "Failed to add item to cart. Please try again.",
                            icon: "error",
                            confirmButtonText: "Okay",
                          });
                        }
                      }}
                    >
                      🛒 <span>Add to Cart</span>
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {otherProducts.length > itemsPerPage && (
            <div className="pagination d-flex justify-content-center align-items-center my-4">
              <button className="btn btn-outline-primary mx-2" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button className="btn btn-outline-primary mx-2" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
  );
}
