import React from "react";
import "../styles/OccupationSection.css";

export default function OccupationSection() {
  const occasions = [
    {
      title: "Wedding",
      img: "https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw770a9bca/homepage/tanishq-pillars/tw-nt-wedding-desktop.jpg",
      delay: 100,
    },
    {
      title: "Festive",
      img: "https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw770a9bca/homepage/tanishq-pillars/tw-nt-wedding-desktop.jpg",
      delay: 200,
    },
    {
      title: "Office Wear",
      img: "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw28989eec/homepage/trendingNow/18kt-jewellery.jpg",
      delay: 300,
    },
    {
      title: "Party",
      img: "https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw770a9bca/homepage/tanishq-pillars/tw-nt-wedding-desktop.jpg",
      delay: 400,
    },
  ];

  return (
    <section className="occasions text-center" data-aos="fade-up">
      <h2 className="section-title">Shop by Occasion</h2>
      <p className="text-1xl">
        Find the perfect jewel for every significant moment in life.
      </p>
      <div className="occasion-grid ">
        {occasions.map((occasion, index) => (
          <div
            className="occasion-card"
            key={index}
            data-aos="fade-up"
            data-aos-delay={occasion.delay}
          >
            <img src={occasion.img} alt={`${occasion.title} Jewelry`} />
            <p>{occasion.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
