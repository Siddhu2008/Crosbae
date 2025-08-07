import React from "react";
import { Link } from "react-router-dom";

import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container ">
        <div className="row row-cols-2 row-col-lg-4 row-col-sm-2gy-4">
          {/* <!-- Logo & Description --> */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="brand-logo">
              <i className="bi bi-award-fill text-warning me-1"></i>
              <span className="text-warning">Cros</span>{" "}
              <span className="text-orange">Bae</span>
            </h5>
            <p className="text-muted">
              Discover the finest collection of imitation jewelry crafted with
              precision and passion. Every piece tells a story of elegance and
              style.
            </p>
            <div className="social-icons d-flex">
              <i className="bi bi-facebook me-3"></i>
              <i className="bi bi-instagram me-3"></i>
              <i className="bi bi-twitter-x"></i>
            </div>
          </div>

          {/* <!-- Quick Links --> */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/shop">
                  <span href="/shop">Shop All</span>
                </Link>
              </li>
              <li>
                <Link to="/collections">
                  <span>Collections</span>
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <span>Jewelry Care</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Customer Service --> */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="fw-bold">Customer Service</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/contact">Shipping Info</a>
              </li>
              <li>
                <a href="/contact">Returns & Exchange</a>
              </li>
              <li>
                <a href="/contact">Size Guide</a>
              </li>
              <li>
                <a href="/contact">FAQ</a>
              </li>
              <li>
                <a href="/contact">Support</a>
              </li>
            </ul>
          </div>

          {/* <!-- Contact Info --> */}
          <div className="col-12 col-lg-4">
            <h6 className="fw-bold">Contact Info</h6>
            <p>
              <i className="bi bi-geo-alt-fill text-warning me-2"></i>123
              Jewelry Street, Fashion District, City 12345
            </p>
            <p>
              <i className="bi bi-telephone-fill text-warning me-2"></i>+91
              98765 43210
            </p>
            <p>
              <i className="bi bi-envelope-fill text-warning me-2"></i>
              hello@crosbae.com
            </p>
            <p className="fw-bold mb-0">Business Hours:</p>
            <p>
              Mon - Sat: 10:00 AM - 8:00 PM
              <br />
              Sunday: 11:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
          <p className="mb-2 mb-md-0 text-muted">
            © 2024 Cros Bae. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#" className="mx-3">
              Terms of Service
            </a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
