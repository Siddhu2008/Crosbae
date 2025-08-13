import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/CollectionsPage.css";

const collections = [
  {
    title: "Rings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47da8133/homepage/shopByCategory/rings-cat.jpg",
  },
  {
    title: "Necklaces",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweefc1d68/homepage/shopByCategory/rings-cat.jpg",
  },
  {
    title: "Earrings",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb06d9b02/homepage/shopByCategory/earrings-cat.jpg",
  },
  {
    title: "Bangles",
    img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwf90107fc/homepage/shopByCategory/earrings-cat.jpg",
  },
];

export default function CollectionsPage() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="collection-container" style={{paddingTop:"120px",}}>
      <h2 className="text-center mb-5" data-aos="fade-down">
        Our Collections
      </h2>

      <div className="row row-cols-2 row-cols-md-4 g-4">
        {collections.map((item, index) => (
          <div
            className="col"
            key={index}
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <div className="card royal-card h-100 text-center shadow-lg">
              <div className="img-wrapper">
                <img src={item.img} alt={item.title} className="card-img-top" />
                <div className="overlay">
                  <button className="btn-expo">Explore {item.title}</button>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  