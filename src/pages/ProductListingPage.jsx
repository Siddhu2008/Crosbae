// src/pages/ProductListingPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import { usePurity } from "../contexts/PurityContext";
import Seo from "../components/Seo";
import "../styles/ProductListingPage.css";

// ✅ new imports
import useWishlist from "../hooks/useWishlist";
import useCart from "../hooks/useCart";

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
  const { state: categoryState } = useCategory();
  const categories = categoryState?.categories || [];
  const { state: metalState } = useMetalType();
  const metalTypes = metalState?.metalTypes || [];
  const { state: stoneState } = useStoneType();
  const stoneTypes = stoneState?.stoneTypes || [];
  const { state: purityState } = usePurity();
  const purities = purityState?.purities || [];
  const location = useLocation();

  const token = localStorage.getItem("access");
  const { wishlistProductIds, toggleWishlist } = useWishlist(token);
  const { addToCart } = useCart(token);

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

  // 🖼️ New state to hold products with images
  const [productsWithImages, setProductsWithImages] = useState([]);

  // 🖼️ Fetch images for each product and add to product object
  useEffect(() => {
  async function fetchProductImages() {
    const baseUrl = "https://api.crosbae.com"; // ✅ backend base URL
    try {
      const updatedProducts = await Promise.all(
        productsList.map(async (product) => {
          try {
            const res = await fetch(`${baseUrl}/v1/inventory/products/${product.id}/images/`);

            // ✅ If no images found — use fallback
            if (res.status === 404) {
              return { ...product, images: ["/fallback-image.jpg"] };
            }

            if (!res.ok) throw new Error("Failed to fetch images");

            const data = await res.json();

            let images = [];

            if (Array.isArray(data)) {
              images = data.map((img) => {
                let imgUrl = img.url || img.url_full || "";
                if (imgUrl && !imgUrl.startsWith("http")) imgUrl = baseUrl + imgUrl;
                return imgUrl;
              });
            } else if (data && typeof data === "object" && data.url) {
              let imgUrl = data.url;
              if (imgUrl && !imgUrl.startsWith("http")) imgUrl = baseUrl + imgUrl;
              images = [imgUrl];
            } else if (data && data.images) {
              if (Array.isArray(data.images)) {
                images = data.images.map((img) => {
                  let imgUrl = img.url || img;
                  if (imgUrl && !imgUrl.startsWith("http")) imgUrl = baseUrl + imgUrl;
                  return imgUrl;
                });
              } else if (typeof data.images === "object") {
                images = Object.values(data.images).map((imgUrl) => {
                  if (imgUrl && !imgUrl.startsWith("http")) imgUrl = baseUrl + imgUrl;
                  return imgUrl;
                });
              }
            }

            return { ...product, images: images.length ? images : ["/fallback-image.jpg"] };
          } catch (error) {
            console.error(`Error fetching images for product ${product.id}:`, error);
            return { ...product, images: ["/fallback-image.jpg"] };
          }
        })
      );
      setProductsWithImages(updatedProducts);
    } catch (error) {
      console.error("Error fetching product images:", error);
      setProductsWithImages(
        productsList.map((p) => ({ ...p, images: ["/fallback-image.jpg"] }))
      );
    }
  }

  if (productsList.length > 0) {
    fetchProductImages();
  } else {
    setProductsWithImages([]);
  }
}, [productsList]);

  // 🧮 Filter products
  const filteredProducts = useMemo(() => {
    let result = [...productsWithImages];
    if (filters.search)
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    if (filters.category.length)
      result = result.filter((p) => filters.category.includes(String(p.category)));
    if (filters.purity.length)
      result = result.filter((p) => filters.purity.includes(String(p.purity)));
    if (filters.metalType.length)
      result = result.filter(
        (p) => p.metal_type && filters.metalType.includes(String(p.metal_type))
      );
    if (filters.stoneType.length)
      result = result.filter(
        (p) => p.stone_type && filters.stoneType.includes(String(p.stone_type))
      );
    if (filters.occasion.length)
      result = result.filter((p) => filters.occasion.includes(p.occasion));
    if (sortOption === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "priceHighLow") result.sort((a, b) => b.price - a.price);
    else if (sortOption === "newest") result.sort((a, b) => new Date(b.date) - new Date(a.date));
    return result;
  }, [filters, sortOption, productsWithImages]);

  // 🪄 Separate matched and other products
  const { matchedProducts, otherProducts } = useMemo(() => {
    if (!categoryQuery) return { matchedProducts: [], otherProducts: filteredProducts };
    const matched = filteredProducts.filter((p) => String(p.category) === String(categoryQuery));
    const others = filteredProducts.filter((p) => String(p.category) !== String(categoryQuery));
    return { matchedProducts: matched, otherProducts: others };
  }, [filteredProducts, categoryQuery]);

  // 📃 Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return otherProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [otherProducts, currentPage]);

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

  const handleSearchChange = (e) => setFilters((prev) => ({ ...prev, search: e.target.value }));

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

      {/* Product Grid */}
      <div className="product-listing-page">
        <div className="product-grid">
          {[...matchedProducts, ...paginatedProducts].map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-image-section">
                {p.tags?.length > 0 && (
                  <div className="product-tags">
                    {(Array.isArray(p.tags) ? p.tags : [p.tags]).map((tag, i) => (
                      <span key={i} className="product-tag" style={getTagStyle(tag)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  className={`like-btn ${wishlistProductIds[p.id] ? "liked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p);
                  }}
                >
                  ♥
                </button>
                <Link to={`/product/${p.id}`} className="product-image-link">
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? p.images[0]
                        : "/fallback-image.jpg"
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
                  <button className="cart-btn" onClick={() => addToCart(p)}>
                    🛒 <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
