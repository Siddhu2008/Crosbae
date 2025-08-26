import React, { useRef } from "react";
import "../styles/CustomerReviews.css";

export default function CustomerReviews() {
  const scrollContainerRef = useRef(null);

  const reviews = [
    {
      text: "Absolutely stunning jewelry! The craftsmanship is superb, and the designs are truly unique. Highly recommend!",
      author: "Arvind Yadav",
      product: "Diamond Necklace",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80", // optional
    },
    {
      text: "I'm so impressed with the quality and the excellent customer service. My necklace is even more beautiful in person.",
      author: "Priya Mehta",
      product: "Gold Necklace",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "The ring I bought was perfect! Fast delivery and premium packaging.",
      author: "Rohit Sharma",
      product: "Engagement Ring",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "Best jewelry purchase I’ve ever made. The detailing is flawless.",
      author: "Sneha Kapoor",
      product: "Engagement Ring",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "Best jewelry purchase I’ve ever made. The detailing is flawless.",
      author: "Sneha Kapoor",
      product: "Gold Earrings",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "Best jewelry purchase I’ve ever made. The detailing is flawless.",
      author: "Sneha Kapoor",
      product: "Gold Earrings",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "Best jewelry purchase I’ve ever made. The detailing is flawless.",
      author: "Sneha Kapoor",
      product: "Gold Earrings",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      text: "Best jewelry purchase I’ve ever made. The detailing is flawless.",
      author: "Sneha Kapoor",
      product: "Gold Earrings",
      profileImage:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80",
    },
  ];

  // Scroll left
  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // Scroll right
  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="customer-reviews-section">
      <h2 className="section-title text-center ">What Our Customers Say</h2>

      <div className="reviews-wrapper">
        <button className="scroll-btn left" onClick={scrollLeft}>
          &#8249;
        </button>

        <div
          className="reviews-container hide-scrollbar"
          ref={scrollContainerRef}
        >
          <div className="scroll-track d-flex gap-3">
            {reviews.map((review, i) => (
              <div className="testimonial-card" key={i}>
                <div className="profile-wrapper">
                  {review.profileImage && (
                    <img
                      src={review.profileImage}
                      alt={review.author}
                      className="profile-img"
                    />
                  )}
                </div>
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, k) => (
                      <span key={k} className="star">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <p className="review-author">
                    <strong>- {review.author}</strong>
                  </p>
                  <p className="product-name">{review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </section>
  );
}
