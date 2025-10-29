import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext"; // Adjust path as needed

// ... inside your component ...

const OrderItemsSection = ({ order }) => {
  const { state: productState } = useProduct();
  const { products } = productState;
  const navigate = useNavigate();

  // Function to get enriched product data
  const getEnrichedProductData = (orderItem) => {
    // Try to find product in ProductContext first
    const productFromContext = products.find(p => p.id === orderItem.product);
    
    if (productFromContext) {
      return {
        name: productFromContext.name,
        price: productFromContext.price,
        image: productFromContext.images?.[0]?.url_full || "",
        isAvailable: true
      };
    }
    
    // Fallback to order API data if product not found in context
    return {
      name: orderItem.product_name || "Product Not Available",
      price: orderItem.product_price || orderItem.price,
      image: "", // No image available from order data
      isAvailable: false
    };
  };

  // Function to handle item click
  const handleItemClick = (productId, isAvailable) => {
    if (isAvailable && productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <section className="od-section">
      <h2 className="od-subtitle">Items</h2>
      <div className="od-items">
        {order.details.map((item, index) => {
          const productData = getEnrichedProductData(item);
          const isClickable = productData.isAvailable && item.product;
          
          return (
            <div 
              key={`${item.id}-${index}`} 
              className={`od-item ${isClickable ? 'clickable' : 'unavailable'}`}
              onClick={() => handleItemClick(item.product, productData.isAvailable)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <img
                src={productData.image || "/fallback-image.jpg"}
                alt={productData.name}
                className="od-thumb"
                onError={(e) => {
                  e.target.src = "/fallback-image.jpg";
                }}
              />
              <div className="od-item-info">
                <p className="od-item-name">
                  {productData.name}
                  {!productData.isAvailable && (
                    <span className="unavailable-badge"> (No Longer Available)</span>
                  )}
                </p>
                <p className="od-item-meta">
                  Qty: {item.quantity} • ₹{productData.price}
                </p>
                {!productData.isAvailable && (
                  <p className="od-item-note">
                    This product is no longer available in our catalog
                  </p>
                )}
              </div>
              {isClickable && (
                <div className="od-item-arrow">
                  <i className="bi bi-chevron-right"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add CSS styles */}
      <style jsx>{`
        .od-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .od-item.clickable:hover {
          background-color: #f7fafc;
          border-color: #d1a054;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .od-item.unavailable {
          opacity: 0.7;
          background-color: #f8f9fa;
        }
        
        .od-thumb {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 16px;
        }
        
        .od-item-info {
          flex: 1;
        }
        
        .od-item-name {
          font-weight: 600;
          margin-bottom: 4px;
          color: #2d3748;
        }
        
        .od-item-meta {
          color: #718096;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .od-item-note {
          color: #e53e3e;
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }
        
        .unavailable-badge {
          color: #e53e3e;
          font-size: 12px;
          font-weight: normal;
        }
        
        .od-item-arrow {
          color: #cbd5e0;
          font-size: 16px;
        }
        
        .od-item.clickable:hover .od-item-arrow {
          color: #d1a054;
        }
        
        @media (max-width: 768px) {
          .od-item {
            padding: 10px;
          }
          
          .od-thumb {
            width: 50px;
            height: 50px;
            margin-right: 12px;
          }
        }
      `}</style>
    </section>
  );
};


export default OrderItemsSection;