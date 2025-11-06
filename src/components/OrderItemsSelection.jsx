import React from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";

const OrderItemsSection = ({ order }) => {
  const { state: productState } = useProduct();
  const { products } = productState;
  const navigate = useNavigate();

  // Get enriched product data
  const getEnrichedProductData = (orderItem) => {
    const productFromContext = products.find(
      (p) => p.id === orderItem.product
    );

    if (productFromContext) {
      return {
        name: productFromContext.name,
        price: productFromContext.price,
        image: productFromContext.images?.[0]?.url_full || "",
        isAvailable: true,
      };
    }

    return {
      name: orderItem.product_name || "Product Not Available",
      price: orderItem.product_price || orderItem.price,
      image: "",
      isAvailable: false,
    };
  };

  const handleItemClick = (productId, isAvailable) => {
    if (isAvailable && productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <section className="od-section">
      <h2 className="od-subtitle">Items</h2>

      <div className="od-card-grid">
        {order.details.map((item, index) => {
          const productData = getEnrichedProductData(item);
          const isClickable = productData.isAvailable && item.product;

          return (
            <div
              key={`${item.id}-${index}`}
              className={`od-card ${isClickable ? "clickable" : "unavailable"}`}
              onClick={() =>
                handleItemClick(item.product, productData.isAvailable)
              }
              style={{ cursor: isClickable ? "pointer" : "default" }}
            >
              <div className="od-card-img-wrap">
                <img
                  src={productData.image || "/fallback-image.jpg"}
                  alt={productData.name}
                  className="od-card-img"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
                {!productData.isAvailable && (
                  <span className="od-badge-unavailable">Unavailable</span>
                )}
              </div>

              <div className="od-card-body">
                <p className="od-card-name">{productData.name}</p>
                <p className="od-card-meta">
                  Qty: {item.quantity} • ₹{productData.price}
                </p>
                {!productData.isAvailable && (
                  <p className="od-card-note">
                    This product is no longer available in our catalog
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .od-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

        .od-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.25s ease;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .od-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-color: #d1a054;
        }

        .od-card.unavailable {
          opacity: 0.8;
          background-color: #f9fafb;
        }

        .od-card-img-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .od-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .od-card.clickable:hover .od-card-img {
          transform: scale(1.05);
        }

        .od-card-body {
          padding: 12px 14px;
          flex: 1;
        }

        .od-card-name {
          font-weight: 600;
          font-size: 15px;
          color: #2d3748;
          margin-bottom: 6px;
        }

        .od-card-meta {
          color: #718096;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .od-card-note {
          color: #e53e3e;
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }

        .od-badge-unavailable {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #e53e3e;
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 5px;
        }

        @media (max-width: 768px) {
          .od-card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .od-card-img-wrap {
    height: 140px;
  }
        }
          @media (min-width: 1024px) {
  .od-card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
      `}</style>
    </section>
  );
};

export default OrderItemsSection;
