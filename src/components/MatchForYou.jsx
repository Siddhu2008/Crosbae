import React from "react";
import "../styles/MatchForYou.css"

const categories = [
  {
    title: "Earrings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw83758477/homepage/shopByCategory/earrings-cat.jpg",
  },
  {
    title: "Finger Rings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
  },
  {
    title: "Pendants",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
  },
  {
    title: "Bracelets",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw2562a9fe/homepage/shopByCategory/bracelets-cat.jpg",
  },
  {
    title: "Chains",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwd0550e4c/homepage/shopByCategory/chains-cat.jpg",
  },
  {
    title: "Silver Jewelry",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwd0550e4c/homepage/shopByCategory/chains-cat.jpg",
  },
  {
    title: "Finger Rings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
  },
  {
    title: "Pendants",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
  },
  {
    title: "Gold Jewelry",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw811a2edc/homepage/shopByCategory/chains-cat.jpg",
  },
  {
    title: "View All",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw811a2edc/homepage/shopByCategory/all-jew-cat.jpg",
  },
];

export default function MatchForYou() {
  return (
    <div>
      <section className=" PerfectMatch ">
        <h2 className="section-title text-center" data-aos="fade-up">
          Find Your Perfect Match
        </h2>
        <h5 className="text-center fw-light">Shop by Categories</h5>
        <div className="row mt-4">
  {categories.map((category, index) => (
    <div
      className="col"
      data-aos="fade-up"
      data-aos-delay={100 * (index + 1)}
      key={index}
    >
      <div className="product-card text-center">
        <img
          src={category.img}
          alt={category.title}
          className="img-fluid rounded mb-3"
        />
        <h4>{category.title}</h4>
      </div>
    </div>
  ))}
</div>

      </section>
    </div>
  );
}
