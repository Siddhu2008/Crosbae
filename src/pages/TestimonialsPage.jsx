import React from "react";

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Shah",
      location: "Mumbai, India",
      feedback:
        "Absolutely loved the ring I ordered. The craftsmanship is beautiful and delivery was super fast!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Priya Mehta",
      location: "Delhi, India",
      feedback:
        "I bought a diamond necklace for my anniversary. It’s stunning and exactly as described!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Rahul Verma",
      location: "Bangalore, India",
      feedback:
        "Amazing collection and great customer service. Highly recommend to anyone looking for quality jewellery.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      id: 4,
      name: "Neha Kapoor",
      location: "Pune, India",
      feedback:
        "I’m in love with the platinum bracelet I ordered. Will definitely shop again!",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
      id: 5,
      name: "Aarav Shah",
      location: "Mumbai, India",
      feedback:
        "Absolutely loved the ring I ordered. The craftsmanship is beautiful and delivery was super fast!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 6,
      name: "Aarav Shah",
      location: "Mumbai, India",
      feedback:
        "Absolutely loved the ring I ordered. The craftsmanship is beautiful and delivery was super fast!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  return (
    <div
      className="container"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <h2 className="text-center mb-5">What Our Customers Say 💬</h2>
      <div className="row g-4">
        {testimonials.map((t) => (
          <div className="col " key={t.id}>
            <div className="card h-100 shadow-sm p-3">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="rounded-circle me-3"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
                <div>
                  <h6 className="mb-0">{t.name}</h6>
                  <small className="text-muted">{t.location}</small>
                </div>
              </div>
              <p className="text-muted">“{t.feedback}”</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
