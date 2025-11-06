import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../contexts/CategoryContext";
import { useProduct } from "../contexts/ProductContext";
import "../styles/topCategory.css";

export default function TopCategory() {
  const scrollContainerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const animationIdRef = useRef(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const totalScrollWidthRef = useRef(0);
  const totalScrollableRef = useRef(0);

  const navigate = useNavigate();
  const { state: categoryState } = useCategory();
  const { state: productState } = useProduct();

  const { products = [], loading: productLoading } = productState;
  const { categories = [], loading: categoryLoading } = categoryState;

  // Combine categories with their products
  const categoriesWithProducts = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => {
      const catProducts = (products || []).filter(
        (p) => String(p.category) === String(cat.id)
      );
      return { ...cat, products: catProducts };
    });
  }, [categories, products]);

  // Calculate trending categories
  const trendingCategories = useMemo(() => {
    if (
      productLoading ||
      categoryLoading ||
      !products.length ||
      !categories.length
    )
      return [];

    const scores = {};
    for (const product of products) {
      const cat = categories.find((c) => String(c.id) === String(product.category));
      if (cat) {
        const score = (product.avg_rating || 0) * (product.total_reviews || 1);
        scores[cat.id] = (scores[cat.id] || 0) + score;
      }
    }

    const sorted = [...categories].sort(
      (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
    );

    const top = sorted.slice(0, 12);
    return top.map((c) => ({
      ...c,
      products:
        (categoriesWithProducts.find((cc) => String(cc.id) === String(c.id)) || {})
          .products || [],
    }));
  }, [products, categories, productLoading, categoryLoading]);

  const handleCategoryClick = (name) => {
    navigate(`/shop?category=${encodeURIComponent(name)}`);
  };

  // === Auto scroll logic ===
  const startAutoScroll = () => {
    cancelAnimationFrame(animationIdRef.current);
    animationIdRef.current = requestAnimationFrame(autoScroll);
  };

  const autoScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !scrollTrackRef.current) return;

    if (!isHoveringRef.current && !isDraggingRef.current) {
      if (container.scrollLeft >= totalScrollableRef.current / 2 - 1) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 0.5;
      }
    }

    animationIdRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    if (!trendingCategories.length) return;

    const container = scrollContainerRef.current;
    if (!container || !scrollTrackRef.current) return;

    totalScrollWidthRef.current = scrollTrackRef.current.scrollWidth;
    totalScrollableRef.current =
      totalScrollWidthRef.current - container.clientWidth;

    startAutoScroll();

    return () => cancelAnimationFrame(animationIdRef.current);
  }, [trendingCategories]);

  return (
    <div className="top-category">
      <h2 className="section-title text-center mb-4">Top Categories</h2>

      <div
        className="category-wrapper hide-scrollbar"
        ref={scrollContainerRef}
        style={{ overflowX: "auto", cursor: "grab" }}
      >
        <div className="scroll-track d-flex gap-3" ref={scrollTrackRef}>
          {[...trendingCategories, ...trendingCategories].map((item, index) => (
            <div
              className="category-item text-center"
              key={`category-${item.name}-${index}`}
              style={{ minWidth: "120px", cursor: "pointer" }}
              onClick={() => handleCategoryClick(item.name)}
            >
              <img
                src={
                  item.image
                    ? `https://cdn.crosbae.com/${item.image}`
                    : item.products && item.products.length
                    ? item.products[0].images?.[0]
                    : "https://via.placeholder.com/100"
                }
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <div className="category-name mt-2">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
