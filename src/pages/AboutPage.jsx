import React from "react";
import { Link } from "react-router-dom";

import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page royal-theme">
      <section className="hero-section">
        <div className="container">
          <h1 className="brand-title">About Crosbae</h1>
          <p className="tagline">
            Where timeless elegance meets modern craftsmanship.
          </p>
        </div>
      </section>

      <section className="story-section">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            Founded with a passion for beauty and sophistication,{" "}
            <strong>Crosbae</strong> has grown into a leading name in luxury
            imitation jewelry. Each piece in our collection reflects an
            unwavering commitment to quality, creativity, and contemporary
            fashion sensibilities.
          </p>
          <p>
            Inspired by timeless elegance and designed for today’s modern women,
            Crosbae’s jewelry embodies more than just style — it tells a story
            of confidence, grace, and individuality.
          </p>
        </div>
      </section>

      <section className="mission-vision">
        <div className="container two-col">
          <div className="col">
            <h3>Our Mission</h3>
            <p>
              To empower individuals to express their style through affordable
              yet luxurious jewelry that stands the test of time.
            </p>
          </div>
          <div className="col">
            <h3>Our Vision</h3>
            <p>
              To be the most trusted and loved brand in the world of imitation
              jewelry, delivering elegance and craftsmanship at every
              touchpoint.
            </p>
          </div>
        </div>
      </section>

      <section className="quality-section">
        <div className="container">
          <h2>Uncompromised Quality</h2>
          <p>
            Every Crosbae creation is meticulously crafted using high-quality
            materials that ensure durability, brilliance, and comfort. Our
            artisans and designers follow a stringent quality-check process to
            guarantee every piece you receive reflects perfection and
            sophistication.
          </p>
        </div>
      </section>

      <section className="why-choose">
        <div className="container">
          <h2>Why Choose Crosbae?</h2>
          <ul className="features-list">
            <li>✨ Timeless & Trendy Designs</li>
            <li>💎 Premium Quality Craftsmanship</li>
            <li>📦 Worldwide Shipping & Easy Returns</li>
            <li>🤝 Trusted by Thousands of Customers</li>
            <li>🛡️ 100% Satisfaction Guarantee</li>
          </ul>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Be a Part of the Crosbae Family</h2>
          <p>
            Join thousands who trust Crosbae for elegance, quality, and
            exceptional service. Discover our collections and make every moment
            sparkle.
          </p>
          <Link to="/collections" className="btn-explore">
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
