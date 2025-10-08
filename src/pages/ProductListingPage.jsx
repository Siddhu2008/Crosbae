import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useProduct } from "../contexts/ProductContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import Seo from "../components/Seo";
import { usePurity } from "../contexts/PurityContext";
import { getCart, updateCart } from "../api/cart";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
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
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { state } = useProduct();
  const productsList = state?.products || [];
  const { state: categoryState } = useCategory();
  const categories = categoryState?.categories || [];
  const { state: metalState } = useMetalType();
  const metalTypes = metalState?.metalTypes || [];
  const { state: stoneState } = useStoneType();
  const stoneTypes = stoneState?.stoneTypes || [];
  const { state: purityState } = usePurity();
  const purities = purityState?.purities || [];
  const location = useLocation();

  // Read category query param if present (expects category id)
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryQuery = query.get("category");

  const toggleFilterSidebar = () => setShowFilter(!showFilter);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setWishlistProductIds(storedLikes);
  }, []);

  const toggleLike = (productId) => {
    setWishlistProductIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      localStorage.setItem("likedProducts", JSON.stringify(updated));
      return updated;
    });
  };

  const getTagStyle = (tag) => {
    switch (tag) {
      case "NEW":
        return {
          background: "linear-gradient(to right, #00c9a7, #92fe9d)",
          color: "#fff",
        };
      case "Flat 50% OFF":
        return {
          background: "linear-gradient(to right, #e52d27, #b31217)",
          color: "#fff",
        };
      case "Best Seller":
        return {
          background: "linear-gradient(to right, #f7971e, #ffd200)",
          color: "#000",
        };
      default:
        return {
          background: "linear-gradient(to right, #bfa17f, #f5e6ca)",
          color: "#fff",
        };
    }
  };

  const filteredProducts = useMemo(() => {
  let result = [...productsList];

    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category.length)
      result = result.filter((p) => filters.category.includes(String(p.category)));
    if (filters.purity.length)
      result = result.filter((p) => filters.purity && filters.purity.includes(String(p.purity)));
    if (filters.metalType && filters.metalType.length)
      result = result.filter((p) => p.metal_type && filters.metalType.includes(String(p.metal_type)));
    if (filters.stoneType && filters.stoneType.length)
      result = result.filter((p) => p.stone_type && filters.stoneType.includes(String(p.stone_type)));
    if (filters.occasion.length)
      result = result.filter((p) => filters.occasion.includes(p.occasion));

    if (sortOption === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [filters, sortOption]);

  // If a category query param is present, split products into matched and others.
  const { matchedProducts, otherProducts } = useMemo(() => {
    if (!categoryQuery) return { matchedProducts: [], otherProducts: filteredProducts };
    const matched = filteredProducts.filter((p) => String(p.category) === String(categoryQuery));
    const others = filteredProducts.filter((p) => String(p.category) !== String(categoryQuery));
    return { matchedProducts: matched, otherProducts: others };
  }, [filteredProducts, categoryQuery]);

  // Pagination applies to the 'otherProducts' set (matched products are shown first unpaginated)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return otherProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [otherProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters/sorting change
  }, [filters, sortOption]);

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const updatedValues = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];
    setFilters((prev) => ({ ...prev, [type]: updatedValues }));
  };

  const handleSearchChange = (e) =>
    setFilters((prev) => ({ ...prev, search: e.target.value }));

  const token = localStorage.getItem("access");

  // Fetch wishlist from backend on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const data = await getWishlist(token);
        // If API returns { results: [...] }
        const items = Array.isArray(data) ? data : data.results || [];
        // Assuming each item has a .product field (id or object)
        setWishlistProductIds(items.map(item => item.product?.id || item.product || item.id));
      } catch (err) {
        setWishlistProductIds([]);
      }
    };
    fetchWishlist();
  }, [token]);

  const userId = localStorage.getItem("userId"); // Adjust key if needed

  // Add/remove from wishlist
  const handleWishlistClick = async (product) => {
    if (!token) {
      alert("Please login to use wishlist.");
      return;
    }
    if (!userId) {
      alert("User ID not found.");
      return;
    }
    const isWishlisted = wishlistProductIds.includes(product.id);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id, token);
        setWishlistProductIds(prev => prev.filter(id => id !== product.id));
      } else {
        // Always send both customer and product, just like addToCart
        await addToWishlist({ customer: userId, product: product.id }, token);
        setWishlistProductIds(prev => [...prev, product.id]);
      }
    } catch (err) {
      // Optionally, show the backend error message for easier debugging
      if (err.response && err.response.data && err.response.data.detail) {
        alert("Wishlist action failed: " + err.response.data.detail);
      } else {
        alert("Wishlist action failed.");
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      // 1. Fetch current cart
      const cartData = await getCart(token);
      const cartItems = Array.isArray(cartData) ? cartData : cartData.results || [];
      const existing = cartItems.find(item => item.product === product.id || item.product.id === product.id);

      if (existing) {
        // 2. If already in cart, update quantity
        await updateCart({ product: product.id, quantity: existing.quantity + quantity }, token);
        alert("Cart updated!");
      } else {
        // 3. If not in cart, add new
        await updateCart({ product: product.id, quantity }, token);
        alert("Added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add/update cart");
    }
  };

  return (
    <div className="Product-container position-relative my-5">
      <Seo
        title="Shop All Jewellery"
        description="Explore our wide range of stunning imitation jewellery. Find the perfect piece for every occasion, from gold and diamond to platinum and silver."
        keywords="shop jewellery, buy rings, buy necklaces, artificial jewellery"
      />
      {/* Filter Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary filter"
          onClick={toggleFilterSidebar}
        >
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
      <div
        className={`filter-drawer bg-white  shadow-lg position-fixedh-100 ${
          showFilter ? "start-0" : "start-100"
        }`}
      >
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

        {/* Occasion */}
        <div className="mb-4">
          <h6>Occasion</h6>
          {[
            "Wedding",
            "Party",
            "Festive",
            "Anniversary",
            "Daily Wear",
            "Engagement",
          ].map((occasion) => (
            <div key={occasion} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={occasion}
                id={`occ-${occasion}`}
                checked={filters.occasion.includes(occasion)}
                onChange={(e) => handleCheckboxChange(e, "occasion")}
              />
              <label className="form-check-label" htmlFor={`occ-${occasion}`}>
                {occasion}
              </label>
            </div>
          ))}
        </div>

        {/* Apply & Clear Buttons */}
        <div className="border-top p-3 d-flex justify-content-between">
          <button
            className="btn btn-outline-danger"
            onClick={() =>
              setFilters({
                category: [],
                purity: [],
                occasion: [],
                search: "",
              })
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

      {/* Product Cards */}
      <div className="product-listing-page">
        <div className="product-grid">
          { /* Render matched category products first (if any) */ }
          {matchedProducts.length > 0 && (
            <>
              <h4 className="mb-3">Showing {matchedProducts.length} item(s) in this category</h4>
              {matchedProducts.map((p) => (
                <div className="product-card" key={`matched-${p.id}`}>
                  <div className="product-image-section">
                    {
                      (Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : []).length > 0 && (
                        <div className="product-tags">
                          {(Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : []).map((tag, index) => (
                            <span
                              className={`product-tag ${String(tag)
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`}
                              key={index}
                              style={getTagStyle(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )
                    }
                    <button
                      className={`like-btn ${
                        wishlistProductIds.includes(p.id) ? "liked" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(p);
                      }}
                      aria-label="Like"
                    >
                      ♥
                    </button>
                    <Link to={`/product/${p.id}`} className="product-image-link">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="product-image"
                      />
                    </Link>
                  </div>
                  <div className="product-list-info">
                    <Link
                      to={`/product/${p.id}`}
                      className=" text-decoration-none"
                    >
                      <h6 className="product-cart-title">{p.productName}</h6>
                      <p className="product-desc">
                        {p.description.split(" ").slice(0, 8).join(" ")}
                        {p.description.split(" ").length > 8 ? "..." : ""}
                      </p>
                      <span className="product-price">₹ {p.price}</span>
                    </Link>
                    <div className="product-bottom-row">
                      <button className="cart-btn" onClick={() => addToCart(p)}>
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          stroke="#f7a707"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <hr />
            </>
          )}

          {paginatedProducts.length ? (
            paginatedProducts.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-image-section">
                  {
                    // Ensure tags is always an array before mapping (API may return string/null)
                    (Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : []).length > 0 && (
                      <div className="product-tags">
                        {(Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : []).map((tag, index) => (
                          <span
                            className={`product-tag ${String(tag)
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            key={index}
                            style={getTagStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )
                  }
                  <button
                    className={`like-btn ${
                      wishlistProductIds.includes(p.id) ? "liked" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistClick(p);
                    }}
                    aria-label="Like"
                  >
                    ♥
                  </button>
                  <Link to={`/product/${p.id}`} className="product-image-link">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="product-image"
                    />
                  </Link>
                </div>
                <div className="product-list-info">
                  <Link
                    to={`/product/${p.id}`}
                    className=" text-decoration-none"
                  >
                    <h6 className="product-cart-title">{p.productName}</h6>
                    <p className="product-desc">
                      {p.description.split(" ").slice(0, 8).join(" ")}
                      {p.description.split(" ").length > 8 ? "..." : ""}
                    </p>
                    <span className="product-price">₹ {p.price}</span>
                  </Link>
                  <div className="product-bottom-row">
                    <button className="cart-btn" onClick={() => addToCart(p)}>
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="#f7a707"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products match the selected filters.</p>
          )}
        </div>
        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from(
                  { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                  (_, i) => (
                    <li
                      className={`page-item ${
                        currentPage === i + 1 && "active"
                      }`}
                      key={i}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    currentPage ===
                      Math.ceil(filteredProducts.length / itemsPerPage) &&
                    "disabled"
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
