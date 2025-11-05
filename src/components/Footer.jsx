import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Ensure this CSS file is imported

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Branding */}
          <div className="footer-column">
            <span className="footer-logo">
              <i className="bi bi-award-fill text-warning me-1"></i>
              <span className="text-warning">Cros</span>{" "}
              <span className="footer-heading">Bae</span>
            </span>
            <p className="footer-description">
              Discover the finest collection of imitation jewelry crafted with
              precision and passion. Every piece tells a story of elegance and
              style.
            </p>
            <div className="social-icons">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-twitter-x"></i>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h6 className="footer-heading">Quick Links</h6>
            <ul>
              <li>
                <Link to="/shop">Shop All</Link>
              </li>
              <li>
                <Link to="/collections">Collections</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/">Jewelry Care</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-column">
            <h6 className="footer-heading">Customer Service</h6>
            <ul>
              <li>
                <Link to="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/refund-return-policy">Returns & Exchange</Link>
              </li>
              <li>
                <Link to="/size-guide-and-jewelry-care-policy">Size Guide</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h6 className="footer-heading">Contact Info</h6>
            <p>
              <i className="bi bi-geo-alt-fill text-warning me-2"></i>
              123 Jewelry Street, Fashion District, City 12345
            </p>
            <p>
              <i className="bi bi-telephone-fill text-warning me-2"></i>
              +91 98765 43210
            </p>
            <p>
              <i className="bi bi-envelope-fill text-warning me-2"></i>
              support@crosbae.com
            </p>
            <p className="fw-bold mb-0">Business Hours:</p>
            <p>
              Mon - Sat: 10:00 AM - 8:00 PM <br />
              Sunday: 11:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">© 2025 Cros Bae. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms and Conditions</a>
            <a href="/cookies-policy">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
