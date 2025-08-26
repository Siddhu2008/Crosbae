import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import products from "../data/products"; // product data
import "../styles/ProductListingPage.css";

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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(filters.search.toLowerCase())
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
    setCurrentPage(1);
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
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  return (
    <div className="Product-container position-relative">
      {/* Header */}
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
        className={`filter-drawer bg-white shadow-lg position-fixed top-0 h-100 ${
          showFilter ? "start-0" : "start-100"
        }`}
        style={{
          width: "280px",
          padding: "120px 20px",
          zIndex: 1050,
          overflowY: "auto",
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

        {/* Example filter section (Category) */}
        <div className="mb-4">
          <h6>Category</h6>
          {["Gold", "Diamond", "Silver"].map((cat) => (
            <div key={cat} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={cat}
                checked={filters.category.includes(cat)}
                onChange={(e) => handleCheckboxChange(e, "category")}
              />
              <label className="form-check-label">{cat}</label>
            </div>
          ))}
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
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {paginatedProducts.length ? (
          paginatedProducts.map((p) => (
            <div className="col" key={p.id}>
              <div className="card h-100 shadow-sm position-relative like-hover-card">
                {/* Wishlist button */}
                <button
                  className={`like-btn ${
                    likedProducts.includes(p.id) ? "liked" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(p.id);
                  }}
                >
                  ♥
                </button>

                {/* Link to Product Details */}
                <Link to={`/product/${p.id}`} className="text-decoration-none">
                  <img
                    src={p.image}
                    alt={p.productName}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "250px" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold mb-1 text-dark">{p.productName}</h6>
                    <p className="text-muted small mb-1">{p.description}</p>
                    <p className="fw-semibold text-dark mb-1">₹ {p.price}</p>
                  </div>
                </Link>

                <div className="p-2">
                  <button
                    className="btn custom-cart-btn w-100"
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
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
  );
}
