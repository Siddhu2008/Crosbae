import React, { useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/CollectionsPage.css";
import Seo from "../components/Seo";
import { useCategory } from "../contexts/CategoryContext";
import { useProduct } from "../contexts/ProductContext";
import { Link } from "react-router-dom";

export default function CollectionsPage() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
  const { state: categoryState } = useCategory();
  const { state: productState } = useProduct();

  const { categories = [], loading: categoryLoading, error: categoryError } = categoryState;
  const { products = [], loading: productLoading } = productState;

  const categoriesWithProducts = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => ({
      ...cat,
      products: (products || []).filter((p) => String(p.category) === String(cat.id)),
    }));
  }, [categories, products]);

  if (categoryLoading || productLoading) {
    return (
      <div className="collection-container" style={{ paddingTop: "120px" }}>
        <Seo
          title="Jewellery Collections"
          description="Explore our curated jewellery collections. From timeless classics to modern designs, find the perfect collection to match your style at Cros Bae."
          keywords="jewellery collections, ring collections, necklace sets, earring collections, fashion jewellery sets"
        />
        <h2 className="text-center mb-5" data-aos="fade-down">
          Our Collections
        </h2>
        <div className="text-center py-5">Loading collections...</div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="collection-container" style={{ paddingTop: "120px" }}>
        <Seo
          title="Jewellery Collections"
          description="Explore our curated jewellery collections. From timeless classics to modern designs, find the perfect collection to match your style at Cros Bae."
          keywords="jewellery collections, ring collections, necklace sets, earring collections, fashion jewellery sets"
        />
        <h2 className="text-center mb-5" data-aos="fade-down">
          Our Collections
        </h2>
        <div className="text-center py-5 text-danger">Failed to load collections.</div>
      </div>
    );
  }

  return (
    <div className="collection-container" style={{ paddingTop: "120px" }}>
      <Seo
        title="Jewellery Collections"
        description="Explore our curated jewellery collections. From timeless classics to modern designs, find the perfect collection to match your style at Cros Bae."
        keywords="jewellery collections, ring collections, necklace sets, earring collections, fashion jewellery sets"
      />
      <h2 className="text-center mb-5" data-aos="fade-down">
        Our Collections
      </h2>

      <div className="collections-grid">
        {categoriesWithProducts.map((item, index) => (
          <Link
            to={`/shop?category=${item.id}`}
            className="text-decoration-none"
          >
            <div
              className="royal-card"
              key={item.id || index}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <div className="img-wrapper">
                <img
                  src={
                    item.image
                      ? `https://cdn.crosbae.com/${item.image}`
                      : item.products && item.products.length
                        ? item.products[0].images?.[0]
                        : "https://via.placeholder.com/400x300"
                  }
                  alt={item.name || item.title}
                  className="card-img-top"
                />
                <div className="overlay">
                  <Link to={`/shop?category=${item.id}`} className="btn-expo">
                    Explore {item.name || item.title}
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{item.name || item.title}</h5>
                {item.description ? <p className="card-desc">{item.description}</p> : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
