import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const loading = state?.loading; // ✅ loader

  const { state: categoryState } = useCategory();
  const categories = categoryState?.categories || [];
  const { state: metalState } = useMetalType();
  const metalTypes = metalState?.metalTypes || [];
  const { state: stoneState } = useStoneType();
  const stoneTypes = stoneState?.stoneTypes || [];
  const { state: purityState } = usePurity();
  const purities = purityState?.purities || [];
  const location = useLocation();

  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingMap, setAddingMap] = useState({});
  const [justAddedMap, setJustAddedMap] = useState({});

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryQuery = query.get("category");

  const toggleFilterSidebar = () => setShowFilter(!showFilter);

  const getTagStyle = (tag) => {
    switch (tag) {
      case "NEW":
        return { background: "linear-gradient(to right, #00c9a7, #92fe9d)", color: "#fff" };
      case "Flat 50% OFF":
        return { background: "linear-gradient(to right, #e52d27, #b31217)", color: "#fff" };
      case "Best Seller":
        return { background: "linear-gradient(to right, #f7971e, #ffd200)", color: "#000" };
      default:
        return { background: "linear-gradient(to right, #bfa17f, #f5e6ca)", color: "#fff" };
    }
  };

  const truncateTag = (tag) => {
    if (!tag) return "";
    const parts = String(tag).trim().split(/\s+/);
    if (parts.length <= 2) return parts.join(" ");
    return parts.slice(0, 1).join(" ") + "...";
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
        return { ...product, images: images.length ? images : ["/fallback-image.jpg"] };
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
      (p) => p.metal_type && filters.metalType.includes(String(p.metal_type))
    );
    if (filters.stoneType.length) result = result.filter(
      (p) => p.stone_type && filters.stoneType.includes(String(p.stone_type))
    );
    if (filters.occasion.length) result = result.filter((p) => filters.occasion.includes(p.occasion));
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

        {/* Occasion */}
        <div className="mb-4">
          <h6>Occasion</h6>
          {["Wedding","Party","Festive","Anniversary","Daily Wear","Engagement"].map((occasion) => (
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
      {loading ? (
        <Loader />
      ) : (
        <div className="product-listing-page">
          <div className="product-grid">
            {[...matchedProducts, ...paginatedProducts].map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-image-section">
                  {p.tags && (
                    <div className="product-tags">
                      {(() => {
                        const tags = Array.isArray(p.tags) ? p.tags : [p.tags];
                        const firstTag = tags[0];
                        return (
                          <span className="product-tag" style={getTagStyle(firstTag)}>
                            {truncateTag(firstTag)}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                  <button
                    className={`like-btn ${wishlistProductIds?.[p.id] ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!toggleWishlist) {
                        window.location.href = "/login";
                        return;
                      }
                      toggleWishlist(p);
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
                      className={`cart-btn ${justAddedMap[p.id] ? 'added' : ''}`}
                      onClick={async () => {
                        if (!addToCart) {
                          window.location.href = "/login";
                          return;
                        }
                        try {
                          setAddingMap((s) => ({ ...s, [p.id]: true }));
                          await addToCart(p.id);
                          // show 'Added' state briefly
                          setJustAddedMap((s) => ({ ...s, [p.id]: true }));
                          setTimeout(() => {
                            setJustAddedMap((s) => {
                              const c = { ...s };
                              delete c[p.id];
                              return c;
                            });
                          }, 1800);
                        } catch (e) {
                          // swallow - CartContext handles errors
                        } finally {
                          setAddingMap((s) => {
                            const c = { ...s };
                            delete c[p.id];
                            return c;
                          });
                        }
                      }}
                      disabled={!!addingMap[p.id]}
                    >
                      {addingMap[p.id] ? (
                        <>🔄 <span>Adding...</span></>
                      ) : justAddedMap[p.id] ? (
                        <>✅ <span>Added</span></>
                      ) : (
                        <>🛒 <span>Add to Cart</span></>
                      )}
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
      )}
    </div>
  );
}
