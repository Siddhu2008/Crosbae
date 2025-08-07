import React from "react";
import { Link } from "react-router-dom";

import "../styles/trandingItems.css"; // 👈 create this CSS file
import { Button } from "bootstrap";

const items = [
  {
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
    alt: "Rings",
    title: "Rings",
    desc: "Elegant rings for every occasion",
  },
  {
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw53dce9ad/homepage/trendingNow/rath-yathra.jpg",
    alt: "Auspicious Occasion",
    title: "Auspicious Jewellery",
    desc: "Traditional styles for festivals",
  },
  {
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
    alt: "Pendants",
    title: "Pendants",
    desc: "Graceful pendants to cherish",
  },
  {
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw63553376/homepage/shopByCategory/pendants-cat.jpg",
    alt: "Pendants",
    title: "Pendants",
    desc: "Timeless pendants collection",
  },
];

export default function TrandingItems() {
  return (
    <section className="container trending-section my-5">
      <h2 className="section-title" data-aos="fade-up">
        Trending Now
      </h2>
      <h5 className="text-center fw-light">
        Jewellery pieces everyone’s eyeing right now
      </h5>

      <div className="row row-cols-2 row-cols-md-4 mt-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="col trending-card-wrapper"
            data-aos="fade-up"
            data-aos-delay={100 + index * 50}
          >
            <div className="trending-card">
              <img
                src={item.img}
                alt={item.alt}
                className="img-fluid rounded"
              />
              <div className="overlay">
                <h6 className="title">{item.title}</h6>
                <p className="desc">{item.desc}</p>
                <Link to="/shop">
                  <span className="btn btn-outline-light btn-sm" style={{
                    padding : "5px 70px" }}>
                    View All
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
