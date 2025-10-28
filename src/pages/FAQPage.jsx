import React from "react";
import Seo from "../components/Seo";
import FAQ from "../components/FAQ"; // Assuming the component is in ../components/FAQ.jsx

export default function FAQPage() {
  return (
    <div className="faq-page-container">
      <Seo
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about Cros Bae, including shipping, returns, jewellery care, and more. Our FAQ page is here to help you."
        keywords="faq, frequently asked questions, jewellery help, shipping questions"
      />
      <FAQ />
    </div>
  );
}