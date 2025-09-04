import React, { useState } from "react";
import "../styles/AdminProducts.css";
import Seo from "./Seo";

const dummyProducts = [
  {
    id: 1,
    name: "Diamond Necklace",
    category: "Necklace",
    purity: "22K",
    price: 75000,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Elegant Earrings",
    category: "Earrings",
    purity: "18K",
    price: 32000,
    image: "https://via.placeholder.com/150",
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(dummyProducts);

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirm) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <section className="admin-products-container">
      <Seo title="Manage Products" noIndex />
      <h2>All Products</h2>
      <div className="admin-products-grid">
        {products.map((product) => (
          <div className="admin-product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
            />
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Purity: {product.purity}</p>
            <p>Price: ₹{product.price}</p>
            <div className="admin-actions">
              <button className="edit-btn">Edit</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
