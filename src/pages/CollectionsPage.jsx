import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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
    <div className="container py-5">
      <h2 className="text-center mb-4" data-aos="fade-down">
        Our Collections
      </h2>

      <div className="row row-cols-2 row-cols-md-4 g-4">
        {collections.map((item, index) => (
          <div
            className="col"
            key={index}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
          >
            <div className="card border-0 shadow-sm h-100">
              <img
                src={item.img}
                className="card-img-top rounded"
                alt={item.title}
              />
              <div className="card-body text-center">
                <h6 className="card-title mb-0">{item.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
