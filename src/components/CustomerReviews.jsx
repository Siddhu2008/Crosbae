import React from "react";
import "../styles/CustomerReviews.css"
export default function CustomerReviews() {
  return (
    <section className="container py-5">
      <h2 className="section-title text-center mb-5" data-aos="fade-up">
        What Our Customers Say
      </h2>

      <div className="row g-4">
        <div
          className="col-12 col-md-6"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <div className="testimonial-card p-4 shadow-sm rounded h-100">
            <div className="d-flex justify-content-center mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-warning">
                  &#9733;
                </span>
              ))}
            </div>
            <p className="mb-3 text-center">
              "Absolutely stunning jewelry! The craftsmanship is superb, and the
              designs are truly unique. Highly recommend!"
            </p>
            <p className="text-start  mb-0">
              <strong>- Arvind Yadav</strong>
            </p>
          </div>
        </div>

        <div
          className="col-12 col-md-6"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div className="testimonial-card p-4 shadow-sm rounded h-100">
            <div className="d-flex justify-content-center mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-warning">
                  &#9733;
                </span>
              ))}
            </div>
            <p className="mb-3">
              "I'm so impressed with the quality and the excellent customer
              service. My necklace is even more beautiful in person."
            </p>
            <p className="text-start mb-0">
              <strong>- Arvind Yadav</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5" data-aos="fade-up">
        <a href="#" className="btn btn-gradient px-4 py-2">
          Read More Reviews
        </a>
      </div>
    </section>
  );
}
