import React from "react";
import { Link } from "react-router-dom";

import Seo from "../components/Seo";
import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page royal-theme">
      <Seo
        title="About Us"
        description="Learn about Crosbae's story, our mission, and our commitment to quality in luxury imitation jewelry. Discover why thousands trust us for elegance and style."
        keywords="about cros bae, jewellery brand, imitation jewellery story"
      />
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
            Welcome to Crosbae – where elegance meets everyday sparkle!
At Crosbae, we create anti-tarnish jewelry designed to shine longer and make you feel special every day. Our mission is simple: Luxury at minimal cost – high quality, stunning designs, and affordable prices compared to other brands.

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

      <section className="why-choose py-20 bg-gradient-to-b from-[#fffaf3] to-[#fdf6e3] text-center">
  <div className="container max-w-5xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-semibold text-[#a3832c] uppercase tracking-wide mb-10">
      Why Choose Crosbae?
    </h2>

    <ul className="features-list grid grid-cols-1 md:grid-cols-2 gap-8 text-[#3a2e14]">
      <li className="bg-[#f2d186] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-lg font-serif leading-relaxed">
        <strong className="block text-[#a3832c] mb-2">• Design to be Yours:</strong>
        Jewelry made to reflect your style and personality.
      </li>
      <li className="bg-[#f2d186] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-lg font-serif leading-relaxed">
        <strong className="block text-[#a3832c] mb-2">• Long-Lasting Shine:</strong>
        Anti-tarnish pieces that stay beautiful over time.
      </li>
      <li className="bg-[#f2d186] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-lg font-serif leading-relaxed">
        <strong className="block text-[#a3832c] mb-2">• Versatile Elegance:</strong>
        Perfect for daily wear or special occasions.
      </li>
      <li className="bg-[#f2d186] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-lg font-serif leading-relaxed">
        <strong className="block text-[#a3832c] mb-2">• Customer First:</strong>
        We’re always here to assist via Email or WhatsApp.
      </li>
    </ul>

    <p className="mt-12 text-lg md:text-xl font-serif text-[#3a2e14] max-w-3xl mx-auto leading-relaxed italic">
      Crosbae jewelry isn’t just an accessory — it’s a statement of your style and confidence.
    </p>
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
