import React from "react";
import "../styles/ShopServices.css";

export default function ShopServices() {
  return (
    <div>
      <section >
        <h2 className="section-title text-center" data-aos="fade-up">
          Jewelry with a Promise
        </h2>
        <h5 className="text-center fw-light">
          Trusted by thousands, crafted with care.
        </h5>

        <div className="row row-cols-2 row-col-lg-4 row-col-sm-2 text-center ">
          <div
            className="col-lg-3 col-sm-6 col-xs-6 mb-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="feature-box">
              <img
                src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweb2d8253/homepage/assurance/tanishq-transparency.svg" // You can replace this with a shorter base64 string or a local image.
                alt="Feature"
                className="img-fluid"
              />
              <h4>Quality Assured</h4>
              <p>Premium materials with quality guarantee</p>
            </div>
          </div>
          <div
            className="col-lg-3 col-sm-6 col-xs-6 mb-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="feature-box">
              <img
                src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweb2d8253/homepage/assurance/tanishq-transparency.svg" // You can replace this with a shorter base64 string or a local image.
                alt="Feature"
                className="img-fluid"
              />
              <h4>Free Shipping</h4>
              <p>Free delivery on orders above ₹1999</p>
            </div>
          </div>
          <div
            className="col-lg-3 col-sm-6 col-xs-6 mb-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="feature-box">
              <img
                src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweb2d8253/homepage/assurance/tanishq-transparency.svg" // You can replace this with a shorter base64 string or a local image.
                alt="Feature"
                className="img-fluid"
              />
              <h4>Exclusive Designs</h4>
              <p>Unique pieces you won't find elsewhere</p>
            </div>
          </div>

          <div
            className="col-lg-3 col-sm-6 col-xs-6 mb-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="feature-box">
              <img
                src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dweb2d8253/homepage/assurance/tanishq-transparency.svg" // You can replace this with a shorter base64 string or a local image.
                alt="Feature"
                className="img-fluid"
              />
              <h4>Handcrafted</h4>
              <p>Carefully crafted by skilled artisans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
