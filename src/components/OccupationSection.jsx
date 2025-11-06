import React from "react";
import { Link } from "react-router-dom";
import "../styles/OccupationSection.css";

export default function OccupationSection() {
  const occasions = [
    {
      title: "Wedding",
      img: "https://cdn.crosbae.com/images/wedding.jpg",
      delay: 100,
    },
    {
      title: "Festive",
      img: "https://cdn.crosbae.com/images/Festive.jpg",
      delay: 200,
    },
    {
      title: "Office Wear",
      img: "https://cdn.crosbae.com/images/office.jpg",
      delay: 300,
    },
    {
      title: "Party",
      img: "https://cdn.crosbae.com/images/Party.jpg",
      delay: 400,
    },
  ];

  return (
    <section className="occasions text-center" data-aos="fade-up">
      <h2 className="section-title">Shop by Occasion</h2>
      <p className="text-1xl">
        Find the perfect jewel for every significant moment in life.
      </p>

      <div className="occasion-grid">
        {occasions.map((occasion, index) => (
          <Link
            key={index}
            to={`/shop?occasion=${encodeURIComponent(occasion.title)}`}
            className="occasion-card-link"
          >
            <div
              className="occasion-card"
              data-aos="fade-up"
              data-aos-delay={occasion.delay}
            >
              <img src={occasion.img} alt={`${occasion.title} Jewelry`} />
              <p>{occasion.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
