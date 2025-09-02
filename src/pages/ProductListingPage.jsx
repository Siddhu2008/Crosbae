import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import products from "../data/products";
import "../styles/ProductListingPage.css"
export default function ProductListingPage() {

  const [filters, setFilters] = useState({
    category: [],
    purity: [],
    occasion: [],
    search: "",
  });
  const [sortOption, setSortOption] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const toggleFilterSidebar = () => setShowFilter(!showFilter);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(storedLikes);
  }, []);

  const toggleLike = (productId) => {
    setLikedProducts((prev) => {
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
    let result = [...products];

    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category.length)
      result = result.filter((p) => filters.category.includes(p.category));
    if (filters.purity.length)
      result = result.filter((p) => filters.purity.includes(p.purity));
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

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

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

  return (
    <div className="Product-container position-relative my-5">
      {/* Filter Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary"
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
        className={`filter-drawer bg-white  shadow-lg position-fixed top-0 h-100 ${showFilter ? "start-0" : "start-100"
          }`}
        style={{
          width: "280px",
          padding: "120px 20px",
          zIndex: 1050,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
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
          {["Gold", "Diamond", "Platinum", "Silver"].map((cat) => (
            <div key={cat} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={cat}
                id={`cat-${cat}`}
                checked={filters.category.includes(cat)}
                onChange={(e) => handleCheckboxChange(e, "category")}
              />
              <label className="form-check-label" htmlFor={`cat-${cat}`}>
                {cat}
              </label>
            </div>
          ))}
        </div>

        {/* Purity */}
        <div className="mb-4">
          <h6>Purity</h6>
          {["22KT", "18KT", "PT950", "925"].map((purity) => (
            <div key={purity} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={purity}
                id={`purity-${purity}`}
                checked={filters.purity.includes(purity)}
                onChange={(e) => handleCheckboxChange(e, "purity")}
              />
              <label className="form-check-label" htmlFor={`purity-${purity}`}>
                {purity}
              </label>
            </div>
          ))}
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
          {paginatedProducts.length ? (
            paginatedProducts.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-image-section">
                  {p.tags && (
                    <div className="product-tags">
                      {p.tags.map((tag, index) => (
                        <span
                          className={`product-tag ${tag.replace(/\s+/g, "-").toLowerCase()}`}
                          key={index}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    className={`like-btn ${likedProducts.includes(p.id) ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(p.id);
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
                  <h6 className="product-cart-title">{p.productName}</h6>
                  <p className="product-desc">
                    {p.description
                      .split(" ")
                      .slice(0, 8)
                      .join(" ")}
                    {p.description.split(" ").length > 8 ? "..." : ""}
                  </p>
                  <span className="product-price">₹ {p.price}</span>
                  <div className="product-bottom-row">
                    <button className="cart-btn" onClick={() => addToCart(p)}>
                      <svg width="22" height="22" fill="none" stroke="#f7a707" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
                      </svg><span>Add to Cart</span>
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
                      className={`page-item ${currentPage === i + 1 && "active"}`}
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
                  className={`page-item ${currentPage ===
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
