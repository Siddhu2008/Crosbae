import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/heroSection.css";

export default function HeroSection() {
  const slidesRef = useRef([]);
  const dotsRef = useRef([]);
  const [_currentIndex, setCurrentIndex] = useState(0);
  const autoSlideInterval = 5000;
  const autoSlideTimer = useRef(null);

  const showSlide = (index) => {
    slidesRef.current.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dotsRef.current.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % slidesRef.current.length;
      showSlide(nextIndex);
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexCalc =
        (prevIndex - 1 + slidesRef.current.length) % slidesRef.current.length;
      showSlide(prevIndexCalc);
      return prevIndexCalc;
    });
  };

  const startAutoSlide = () => {
    autoSlideTimer.current = setInterval(nextSlide, autoSlideInterval);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer.current);
    startAutoSlide();
  };

  useEffect(() => {
    showSlide(0);
    startAutoSlide();
    return () => clearInterval(autoSlideTimer.current);
  }, []);

  return (
    <div className="hero-carousel">
      {[1, 2].map((_, index) => (
        <div
          key={index}
          className={`hero-slide hero-slide-${index + 1} ${
            index === 0 ? "active" : ""
          }`}
          ref={(el) => (slidesRef.current[index] = el)}
        >
          <div className="hero-text-box mx-auto">
            <h1>
              {index === 0
                ? "Discover Timeless Elegance"
                : "Crafted with Passion & Precision"}
            </h1>
            <p>
              {index === 0
                ? "Explore our exquisite collection of fine jewelry."
                : "Experience the artistry in every piece."}
            </p>
            <div className="hero-btns">
              <Link to="/shop" className="btn btn-gradient btn-lg mt-3 ms-3">
                {index === 0 ? "Shop Now" : "View Collections"}
              </Link>
              <Link
                to="/about"
                className="btn btn-outline-light btn-lg mt-3 ms-3"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        className="carousel-btn left"
        onClick={() => {
          prevSlide();
          resetAutoSlide();
        }}
      >
        &#10094;
      </button>
      <button
        className="carousel-btn right"
        onClick={() => {
          nextSlide();
          resetAutoSlide();
        }}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {[0, 1].map((_, index) => (
          <span
            key={index}
            className={`dot ${index === 0 ? "active" : ""}`}
            ref={(el) => (dotsRef.current[index] = el)}
            onClick={() => {
              showSlide(index);
              resetAutoSlide();
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
