import React, { useState, useMemo, useEffect } from "react";
import products from "../data/products"; // your product data
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

  const toggleLike = (productId) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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

  return (
    <div className="container py-4 position-relative">
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
        className={`filter-drawer bg-white p-4 shadow-lg position-fixed top-0 h-100 ${
          showFilter ? "start-0" : "start-100"
        }`}
        style={{
          width: "280px",
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
      <div className="row row-cols-2 row-col-lg-4 row-col-sm-2 row-col-xs-1 g-3">
        {paginatedProducts.length ? (
          paginatedProducts.map((p) => (
            <div className="col-lg-3 col-sm-6 col-xs-12" key={p.id}>
              <div className="card h-100 shadow-sm position-relative like-hover-card">
                {p.tags && (
                  <div className="product-tag position-absolute top-0 start-0 p-2">
                    {p.tags.map((tag, index) => (
                      <span
                        className="badge me-1 mb-1"
                        style={getTagStyle(tag)}
                        key={index}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
                <img
                  src={p.image}
                  alt={p.name}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="card-body">
                  <h6 className="fw-bold mb-1">{p.productName}</h6>
                  <p className="text-muted small mb-1">{p.description}</p>
                  <p className="fw-semibold text-dark mb-1">₹ {p.price}</p>
                  <div className="mt-2 d-flex justify-center gap-5">
                    <button className="btn btn-sm btn-outline-primary">
                      Add to Cart
                    </button>
                  </div>
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
