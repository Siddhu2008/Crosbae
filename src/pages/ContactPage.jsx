import React from "react";
import "../styles/ContactPage.css"

export default function ContactPage() {
  return (
    <section className="contact-page" style={{paddingTop:"120px",paddingBottom:"100px"}}>
      <div className="contact-hero">
        <h1>We're Here to Help</h1>
        <p>
          Whether you have questions, feedback, or simply want to connect — we’d
          love to hear from you.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-details">
          <h2>Contact Information</h2>
          <p>
            <strong>📍 Address:</strong> 123 Jewelry Street, Fashion District,
            City 12345
          </p>
          <p>
            <strong>📞 Phone:</strong> +91 98765 43210
          </p>
          <p>
            <strong>📧 Email:</strong> hello@crosbae.com
          </p>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Mon - Sat: 10:00 AM – 8:00 PM</p>
            <p>Sunday: 11:00 AM – 6:00 PM</p>
          </div>

          <div className="social-icons">
            <h3>Follow Us</h3>
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-send">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
