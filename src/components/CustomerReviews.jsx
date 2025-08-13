import React from "react";
import "../styles/CustomerReviews.css";
import { Link } from "react-router-dom";

export default function CustomerReviews() {
  return (
    <section className="  py-5 customer-reviews-section">
  
    <h2 className="section-title text-center mb-5" data-aos="fade-up">
      What Our Customers Say
    </h2>
    <div className="cards">
      <div className="card1" data-aos="fade-right" data-aos-delay="100">
        <div className="testimonial-card royal-shadow p-4 rounded h-100">
          <div className="stars text-center mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">&#9733;</span>
            ))}
          </div>
          <p className="review-text text-center">
            "Absolutely stunning jewelry! The craftsmanship is superb, and the designs are truly unique. Highly recommend!"
          </p>
          <p className="review-author text-start mb-0">
            <strong>- Arvind Yadav</strong>
          </p>
        </div>
      </div>

      <div className="card2" data-aos="fade-left" data-aos-delay="200">
        <div className="testimonial-card royal-shadow p-4 rounded h-100">
          <div className="stars text-center mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">&#9733;</span>
            ))}
          </div>
          <p className="review-text text-center">
            "I'm so impressed with the quality and the excellent customer service. My necklace is even more beautiful in person."
          </p>
          <p className="review-author text-start mb-0">
            <strong>- Priya Mehta</strong>
          </p>
        </div>
      </div>
      <div className="card2" data-aos="fade-left" data-aos-delay="200">
        <div className="testimonial-card royal-shadow p-4 rounded h-100">
          <div className="stars text-center mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">&#9733;</span>
            ))}
          </div>
          <p className="review-text text-center">
            "I'm so impressed with the quality and the excellent customer service. My necklace is even more beautiful in person."
          </p>
          <p className="review-author text-start mb-0">
            <strong>- Priya Mehta</strong>
          </p>
        </div>
      </div>
      </div>


    <div className="text-center mt-5" data-aos="fade-up">
      <Link to="/testimonials">
        <span className="btn btn-gradient px-4 py-2">Read More Reviews</span>
      </Link>
    </div>
  
</section>

  );
}
