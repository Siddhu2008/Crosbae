import React, { useState } from "react";

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add your favorite items to the cart, and proceed to checkout to complete your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and PayPal payments.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes! Once your order is shipped, you will receive a tracking number via email.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on all jewelry items. The products must be in original condition.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach out to us via the Contact page or email us at support@crosbae.com.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px", margin: "auto", padding: "2rem", paddingTop: "80px", paddingBottom: "20px",
      }}
    >
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => toggleIndex(index)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "1rem",
                fontSize: "1.1rem",
                background: "#f7f7f7",
                border: "none",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  background: "#fff",
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
