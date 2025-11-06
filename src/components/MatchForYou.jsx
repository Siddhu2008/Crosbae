import React from "react";
import { Link } from "react-router-dom";
import "../styles/MatchForYou.css";
import { useCategory } from "../contexts/CategoryContext";
import { useProduct } from "../contexts/ProductContext";

export default function MatchForYou() {
  const { state } = useCategory();
  const { categories, loading, error } = state;
  const { state: productState } = useProduct();
  const products = productState?.products || [];

  const categoriesWithProducts = (categories || []).map((cat) => ({
    ...cat,
    products: products.filter((p) => String(p.category) === String(cat.id)),
  }));

  // global loader will show while categories load

  if (error) {
    return (
      <section className="PerfectMatch text-center py-5">
        <h4 className="text-danger">Failed to load categories 😢</h4>
      </section>
    );
  }

  return (
    <section className="PerfectMatch">
      <h2 className="section-title text-center" data-aos="fade-up">
        Find Your Perfect Match
      </h2>
      <h5 className="text-center fw-light">Shop by Categories</h5>

      <div className="row mt-4">
        {categoriesWithProducts.map((category, index) => (
          <div
            className="col"
            data-aos="fade-up"
            data-aos-delay={100 * (index + 1)}
            key={category.id || index}
          >
            <div className="category-card text-center">
              {/* ✅ Redirects to the Shop Page with category filter */}
              <Link
                to={`/shop?category=${category.id}`}
                className="text-decoration-none"
              >
                <img
                  src={
                    (category.image && "https://cdn.crosbae.com/" + category.image) ||
                    (category.products &&
                      category.products[0] &&
                      category.products[0].images?.[0]) ||
                    "https://via.placeholder.com/300"
                  }
                  alt={category.name}
                  className="img-fluid"
                />
                <h4>{category.name}</h4>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
