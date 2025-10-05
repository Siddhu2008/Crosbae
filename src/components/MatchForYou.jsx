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

  if (loading) {
    return (
      <section className="PerfectMatch text-center py-5">
        <h4>Loading categories...</h4>
      </section>
    );
  }

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
              <Link
                to={`/collections/${category.slug || category.id}`}
                className="text-decoration-none"
              >
                <img
                  src={
                    (category.image && "https://cdn.crosbae.com/" + category.image) || (category.products && category.products[0] && category.products[0].images?.[0]) || "https://via.placeholder.com/300"
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


// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/MatchForYou.css";

// const categories = [
//   {
//     title: "Earrings",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw83758477/homepage/shopByCategory/earrings-cat.jpg",
//   },
//   {
//     title: "Finger Rings",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
//   },
//   {
//     title: "Pendants",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
//   },
//   {
//     title: "Bracelets",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw2562a9fe/homepage/shopByCategory/bracelets-cat.jpg",
//   },
//   {
//     title: "Chains",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwd0550e4c/homepage/shopByCategory/chains-cat.jpg",
//   },
//   {
//     title: "Silver Jewelry",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwd0550e4c/homepage/shopByCategory/chains-cat.jpg",
//   },
//   {
//     title: "View All",
//     img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw811a2edc/homepage/shopByCategory/all-jew-cat.jpg",
//   },
// ];

// export default function MatchForYou() {
//   return (
//     <div>
//       <section className=" PerfectMatch ">
//         <h2 className="section-title text-center" data-aos="fade-up">
//           Find Your Perfect Match
//         </h2>
//         <h5 className="text-center fw-light">Shop by Categories</h5>
//         <div className="row mt-4">
//   {categories.map((category, index) => (
//     <div
//       className="col"
//       data-aos="fade-up"
//       data-aos-delay={100 * (index + 1)}
//       key={index}
//     >
//       <div className="category-card text-center">
//         <Link to="/collections" className="text-decoration-none">
//         <img
//           src={category.img}
//           alt={category.title}
//           className="img-fluid"
//         />
//         <h4>{category.title}</h4>
//         </Link>
//       </div>
//     </div>
//   ))}
// </div>

//       </section>
//     </div>
//   );
// }
