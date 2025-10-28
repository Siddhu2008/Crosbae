import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/trandingItems.css";
import ProductContext from "../contexts/ProductContext";
import CategoryContext from "../contexts/CategoryContext"; // ✅ import categories

export default function TrendingItems() {
  const { state: productState } = useContext(ProductContext);
  const { state: categoryState } = useContext(CategoryContext);

  const { products = [], loading: productLoading, error: productError } = productState;
  const { categories = [], loading: categoryLoading, error: categoryError } = categoryState;

  const [trendingCategories, setTrendingCategories] = useState([]);

  useEffect(() => {
    // Wait until both products and categories are loaded
    if (!productLoading && !categoryLoading && products.length > 0 && categories.length > 0) {
      // ✅ Sort products by rating & reviews
      const sorted = [...products].sort((a, b) => {
        const aScore = (a.avg_rating || 0) * (a.total_reviews || 1);
        const bScore = (b.avg_rating || 0) * (b.total_reviews || 1);
        return bScore - aScore;
      });

      // ✅ Extract top categories from top-rated products
      const categoryMap = new Map();
      for (const product of sorted) {
        // Find the full category object using category ID
        const category = categories.find((c) => c.id === product.category);

        if (category && !categoryMap.has(category.name)) {
          categoryMap.set(category.name, {
            name: category.name,
            image: category.image,
            desc: category.description || product.name,
          });
        }

        if (categoryMap.size >= 4) break; // Only top 4 categories
      }

      setTrendingCategories(Array.from(categoryMap.values()));
    }
  }, [productLoading, categoryLoading, products, categories]);

  // Handle loading
  if (productLoading || categoryLoading) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <p className="text-center">Loading...</p>
      </section>
    );
  }

  // Handle error
  if (productError || categoryError) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <p className="text-center">Something went wrong. Please try again later.</p>
      </section>
    );
  }

  // No products case
  if (!products.length) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <p className="text-center">No products available.</p>
      </section>
    );
  }

  // No trending categories found
  if (!trendingCategories.length) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <p className="text-center">No trending products found.</p>
      </section>
    );
  }

  return (
    <section className="trending-section">
      <h2 className="section-title" data-aos="fade-up">
        Trending Now
      </h2>
      <h5 className="text-center fw-light">
        Jewellery pieces everyone’s eyeing right now
      </h5>

      <div className="cards-grid">
        {trendingCategories.map((item, index) => (
          <div
            key={index}
            className="trending-card"
            data-aos="fade-up"
            data-aos-delay={100 + index * 50}
          >
            
            <img
              src={
                item.image
                  ? `https://cdn.crosbae.com/${item.image}`
                  : "https://via.placeholder.com/300x300.png?text=No+Image"
              }
              alt={item.name}
            />
            <div className="overlay">
              <h6 className="title">{item.name}</h6>
              <p className="desc">{item.desc}</p>
              <Link to={`/shop?category=${encodeURIComponent(item.name)}`} className="btn">
                View All
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/trandingItems.css"; // 👈 Make sure this file exists

// const items = [
//   {
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
//     alt: "Rings",
//     title: "Rings",
//     desc: "Elegant rings for every occasion",
//   },
//   {
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw53dce9ad/homepage/trendingNow/rath-yathra.jpg",
//     alt: "Auspicious Occasion",
//     title: "Auspicious Jewellery",
//     desc: "Traditional styles for festivals",
//   },
//   {
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
//     alt: "Pendants",
//     title: "Pendants",
//     desc: "Graceful pendants to cherish",
//   },
//   {
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
//     alt: "Pendants",
//     title: "Pendants",
//     desc: "Timeless pendants collection",
//   },
// ];

// export default function TrandingItems() {
//   return (
//     <section className="trending-section">
//       <h2 className="section-title" data-aos="fade-up">
//         Trending Now
//       </h2>
//       <h5 className="text-center fw-light">
//         Jewellery pieces everyone’s eyeing right now
//       </h5>

//       <div className="cards-grid">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="trending-card"
//             data-aos="fade-up"
//             data-aos-delay={100 + index * 50}
//           >
//             <img src={item.img} alt={item.alt} />
//             <div className="overlay">
//               <h6 className="title">{item.title}</h6>
//               <p className="desc">{item.desc}</p>
//               <Link to="/shop" className="btn">
//                 View All
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
