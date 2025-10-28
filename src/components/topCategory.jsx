import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../contexts/CategoryContext";
import { useProduct } from "../contexts/ProductContext";
import "../styles/topCategory.css";

export default function TopCategory() {
  const scrollContainerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const scrollDotsContainerRef = useRef(null);
  const animationIdRef = useRef(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const currentDotIndexRef = useRef(0);
  const totalScrollWidthRef = useRef(0);
  const totalScrollableRef = useRef(0);

  const navigate = useNavigate();
  const { state: categoryState } = useCategory();
  const { state: productState } = useProduct();

  const { products = [], loading: productLoading } = productState;
  const { categories = [], loading: categoryLoading } = categoryState;

  // Augment categories with their products for easier consumption in UI
  const categoriesWithProducts = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => {
      const catProducts = (products || []).filter((p) => String(p.category) === String(cat.id));
      return { ...cat, products: catProducts };
    });
  }, [categories, products]);

  // ✅ Calculate trending categories using product ratings and reviews
  const trendingCategories = useMemo(() => {

  if (productLoading || categoryLoading || !products.length || !categories.length) return [];

    // Prepare category scores
    const scores = {};
    for (const product of products) {
      const cat = categories.find((c) => String(c.id) === String(product.category));
      if (cat) {
        const score = (product.avg_rating || 0) * (product.total_reviews || 1);
        scores[cat.id] = (scores[cat.id] || 0) + score;
      }
    }

    // Sort categories by score (descending)
    const sorted = [...categories].sort(
      (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
    );

    // attach products to result categories from precomputed map
    const top = sorted.slice(0, 12);
    // if (top.length<1)
    //   top = categories;
    return top.map((c) => ({ ...c, products: (categoriesWithProducts.find((cc) => String(cc.id) === String(c.id)) || {}).products || [] }));
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
    const dots = scrollDotsContainerRef.current?.children;

    if (!container || !scrollTrackRef.current || !dots) return;

    if (!isHoveringRef.current && !isDraggingRef.current) {
      if (container.scrollLeft >= totalScrollableRef.current - 1) {
        container.scrollLeft = 0;
        currentDotIndexRef.current = 0;
      } else {
        container.scrollLeft += 0.5;

        const percentScrolled = container.scrollLeft / totalScrollableRef.current;
        const newDotIndex = Math.round(percentScrolled * (dots.length - 1));
        if (newDotIndex !== currentDotIndexRef.current) {
          dots[currentDotIndexRef.current]?.classList.remove("active");
          dots[newDotIndex]?.classList.add("active");
          currentDotIndexRef.current = newDotIndex;
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    if (!trendingCategories.length) return;

    const container = scrollContainerRef.current;
    const dotsContainer = scrollDotsContainerRef.current;
    if (!container || !scrollTrackRef.current || !dotsContainer) return;

    totalScrollWidthRef.current = scrollTrackRef.current.scrollWidth;
    totalScrollableRef.current = totalScrollWidthRef.current - container.clientWidth;

    const numDots = Math.ceil(trendingCategories.length / 6);
    dotsContainer.innerHTML = "";

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("span");
      dot.classList.add("scroll-dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        cancelAnimationFrame(animationIdRef.current);
        const scrollTo = (totalScrollableRef.current / (numDots - 1)) * i;
        container.scrollTo({ left: scrollTo, behavior: "smooth" });

        const current = dotsContainer.children[currentDotIndexRef.current];
        if (current) current.classList.remove("active");

        dot.classList.add("active");
        currentDotIndexRef.current = i;

        setTimeout(() => startAutoScroll(), 500);
      });

      dotsContainer.appendChild(dot);
    }

    startAutoScroll();

    return () => cancelAnimationFrame(animationIdRef.current);
  }, [trendingCategories]);

  // === JSX ===
  return (
    <div className="top-category">
      <h2 className="section-title text-center mb-4">Top Categories</h2>

      <div
        className="category-wrapper hide-scrollbar"
        ref={scrollContainerRef}
        style={{ overflowX: "auto", cursor: "grab" }}
      >
        <div className="scroll-track d-flex gap-3" ref={scrollTrackRef}>
          {trendingCategories.map((item, index) => (
            <div
              className="category-item text-center"
              key={`category-${item.name}-${index}`}
              style={{ minWidth: "120px", cursor: "pointer" }}
              onClick={() => handleCategoryClick(item.name)}
            >
              {/* Prefer category image, fallback to first product image, then placeholder */}
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

      <div
        className="scroll-dots d-flex justify-content-center gap-2 mt-3"
        ref={scrollDotsContainerRef}
      ></div>
    </div>
  );
}

// import React, { useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom"; // 👈 import navigate
// import "../styles/topCategory.css";

// export default function TopCategory() {
//   const scrollContainerRef = useRef(null);
//   const scrollTrackRef = useRef(null);
//   const scrollDotsContainerRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const isHoveringRef = useRef(false);
//   const isDraggingRef = useRef(false);
//   const startXRef = useRef(0);
//   const scrollLeftRef = useRef(0);
//   const currentDotIndexRef = useRef(0);
//   const totalScrollWidthRef = useRef(0);
//   const totalScrollableRef = useRef(0);

//   const navigate = useNavigate(); // 👈 hook to navigate

//   const items = [
//     {
//       img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw1226b98b/homepage/shopByCategory/bangles-cat.jpg",
//       name: "Gold",
//     },
//     {
//       img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
//       name: "Diamond",
//     },
//     {
//       img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
//       name: "Platinum",
//     },
//     {
//       img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw83758477/homepage/shopByCategory/earrings-cat.jpg",
//       name: "Silver",
//     },
//   ];

//   const handleCategoryClick = (name) => {
//     navigate(`/shop`);
//   };

//   const startAutoScroll = () => {
//     cancelAnimationFrame(animationIdRef.current);
//     animationIdRef.current = requestAnimationFrame(autoScroll);
//   };

//   const autoScroll = () => {
//     const container = scrollContainerRef.current;
//     const dots = scrollDotsContainerRef.current?.children;

//     if (!container || !scrollTrackRef.current || !dots) return;

//     if (!isHoveringRef.current && !isDraggingRef.current) {
//       if (container.scrollLeft >= totalScrollableRef.current - 1) {
//         container.scrollLeft = 0;
//         currentDotIndexRef.current = 0;
//       } else {
//         container.scrollLeft += 0.5;
//         const percentScrolled =
//           container.scrollLeft / totalScrollableRef.current;
//         const newDotIndex = Math.round(percentScrolled * (dots.length - 1));
//         if (newDotIndex !== currentDotIndexRef.current) {
//           dots[currentDotIndexRef.current]?.classList.remove("active");
//           dots[newDotIndex]?.classList.add("active");
//           currentDotIndexRef.current = newDotIndex;
//         }
//       }
//     }

//     animationIdRef.current = requestAnimationFrame(autoScroll);
//   };

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     const dotsContainer = scrollDotsContainerRef.current;

//     if (!container || !scrollTrackRef.current || !dotsContainer) return;

//     totalScrollWidthRef.current = scrollTrackRef.current.scrollWidth;
//     totalScrollableRef.current =
//       totalScrollWidthRef.current - container.clientWidth;

//     const numDots = 5;
//     dotsContainer.innerHTML = "";

//     for (let i = 0; i < numDots; i++) {
//       const dot = document.createElement("span");
//       dot.classList.add("scroll-dot");
//       if (i === 0) dot.classList.add("active");

//       dot.addEventListener("click", () => {
//         cancelAnimationFrame(animationIdRef.current);
//         const scrollTo = (totalScrollableRef.current / (numDots - 1)) * i;
//         container.scrollTo({ left: scrollTo, behavior: "smooth" });

//         const current = dotsContainer.children[currentDotIndexRef.current];
//         if (current) current.classList.remove("active");

//         dot.classList.add("active");
//         currentDotIndexRef.current = i;

//         setTimeout(() => {
//           startAutoScroll();
//         }, 500);
//       });

//       dotsContainer.appendChild(dot);
//     }

//     startAutoScroll();

//     // Mouse events
//     container.addEventListener("mouseenter", () => {
//       isHoveringRef.current = true;
//     });
//     container.addEventListener("mouseleave", () => {
//       isHoveringRef.current = false;
//       if (!isDraggingRef.current) startAutoScroll();
//     });
//     container.addEventListener("mousedown", (e) => {
//       isDraggingRef.current = true;
//       startXRef.current = e.pageX - container.offsetLeft;
//       scrollLeftRef.current = container.scrollLeft;
//       container.style.cursor = "grabbing";
//     });
//     container.addEventListener("mouseup", () => {
//       isDraggingRef.current = false;
//       container.style.cursor = "grab";
//       startAutoScroll();
//     });
//     container.addEventListener("mousemove", (e) => {
//       if (!isDraggingRef.current) return;
//       e.preventDefault();
//       const x = e.pageX - container.offsetLeft;
//       const walk = (x - startXRef.current) * 1.5;
//       container.scrollLeft = scrollLeftRef.current - walk;
//     });

//     // Touch events
//     container.addEventListener("touchstart", (e) => {
//       isDraggingRef.current = true;
//       startXRef.current = e.touches[0].pageX - container.offsetLeft;
//       scrollLeftRef.current = container.scrollLeft;
//     });
//     container.addEventListener("touchend", () => {
//       isDraggingRef.current = false;
//       startAutoScroll();
//     });
//     container.addEventListener("touchmove", (e) => {
//       if (!isDraggingRef.current) return;
//       const x = e.touches[0].pageX - container.offsetLeft;
//       const walk = (x - startXRef.current) * 1.5;
//       container.scrollLeft = scrollLeftRef.current - walk;
//     });

//     return () => {
//       cancelAnimationFrame(animationIdRef.current);
//     };
//   }, []);

//   return (
//     <div className="top-category">
//       <div
//         className="category-wrapper hide-scrollbar"
//         ref={scrollContainerRef}
//         style={{ overflowX: "auto", cursor: "grab" }}
//       >
//         <div className="scroll-track d-flex gap-3" ref={scrollTrackRef}>
//           {Array.from({ length: 6 }).flatMap((_, i) =>
//             items.map((item, j) => (
//               <div
//                 className="category-item text-center"
//                 key={`category-${item.name}-${i}-${j}`}
//                 style={{ minWidth: "120px", cursor: "pointer" }}
//                 onClick={() => handleCategoryClick(item.name)} // 👈 on click
//               >
//                 <img
//                   src={item.img}
//                   alt={item.name}
//                   style={{
//                     width: "100px",
//                     height: "100px",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <div className="category-name mt-2">{item.name}</div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       <div
//         className="scroll-dots d-flex justify-content-center gap-2 mt-3"
//         ref={scrollDotsContainerRef}
//       ></div>
//     </div>
//   );
// }
