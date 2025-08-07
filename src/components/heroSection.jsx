import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/heroSection.css"
export default function HeroSection() {
  const slidesRef = useRef([]);
  const dotsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideInterval = 5000;
  const autoSlideTimer = useRef(null);

  // Show slide function
  const showSlide = (index) => {
    slidesRef.current.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dotsRef.current.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    setCurrentIndex(index);
  };

  // Next and Previous slide functions
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


  // Auto-slide
  const startAutoSlide = () => {
    autoSlideTimer.current = setInterval(nextSlide, autoSlideInterval);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer.current);
    startAutoSlide();
  };

  // Initialize carousel on mount
  useEffect(() => {
    showSlide(0);
    startAutoSlide();
    return () => clearInterval(autoSlideTimer.current); // Cleanup on unmount
  }, []);

  return (
    <div className="hero-carousel" id="heroCarousel">
      {[1, 2].map((_, index) => (
        <div
          key={index}
          className={`hero-slide hero-slide-${index + 1} ${
            index === 0 ? "active" : ""
          }`}
          ref={(el) => (slidesRef.current[index] = el)}
        >
          <div className="hero-text-box mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center">
              <div className="w-full">
                <h1
                  className="text-5xl md:text-6xl font-bold mb-4"
                  data-aos="fade-up"
                >
                  {index === 0
                    ? "Discover Timeless Elegance"
                    : "Crafted with Passion & Precision"}
                </h1>
                <p
                  className="text-xl md:text-2xl mb-8"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {index === 0
                    ? "Explore our exquisite collection of fine jewelry."
                    : "Experience the artistry in every piece."}
                </p>
                <Link to="/shop">
                  <span
                    className="btn btn-gradient btn-lg mt-3"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    {index === 0 ? "Shop Now" : "View Collections"}
                  </span>
                </Link>
                <Link to='/about'>
                <span
                  className="btn btn-outline-light btn-lg mt-3 ms-3"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {index === 0 ? "Learn More" : "Learn More"}
                </span></Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
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

      {/* Dots Indicators */}
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
