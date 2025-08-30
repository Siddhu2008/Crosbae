import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/CollectionsPage.css";

const collections = [
  {
    title: "Rings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
    desc: "Discover our stunning collection of rings for every occasion.",
  },
  {
    title: "Necklaces",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweefc1d68/homepage/shopByCategory/rings-cat.jpg",
    desc: "Elegant necklaces crafted to perfection for your style.",
  },
  {
    title: "Earrings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb06d9b02/homepage/shopByCategory/earrings-cat.jpg",
    desc: "Find the perfect pair of earrings to complement your look.",
  },
  {
    title: "Bangles",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwf90107fc/homepage/shopByCategory/earrings-cat.jpg",
    desc: "Shop our exclusive bangles collection for every celebration.",
  },
];

export default function CollectionsPage() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="collection-container" style={{ paddingTop: "120px" }}>
      <h2 className="text-center mb-5" data-aos="fade-down">
        Our Collections
      </h2>

      <div className="collections-grid">
        {collections.map((item, index) => (
          <div
            className="royal-card"
            key={index}
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <div className="img-wrapper">
              <img src={item.img} alt={item.title} className="card-img-top" />
              <div className="overlay">
                <button className="btn-expo">Explore {item.title}</button>
              </div>
            </div>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
