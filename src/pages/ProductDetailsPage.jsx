import React, { useState } from "react";
import "../styles/ProductDetailsPage.css";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw402efbd6/images/hi-res/51D3D2DEMABA00_2.jpg?sw=1000&sh=1000"
  );

  const thumbnails = [
   "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw81a79f28/images/hi-res/51D3D2DEMABA00_4.jpg?sw=1000&sh=1000",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ28DUEa8FC7PR_R4Wg8X7gQJXykedQ0E9Fqg&s",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw81a79f28/images/hi-res/51D3D2DEMABA00_4.jpg?sw=1000&sh=1000",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw688a495e/images/hi-res/51D3D2DEMABA00_3.jpg?sw=1000&sh=1000",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw077eb895/images/hi-res/51D3D2DEMABA00_1.jpg?sw=1000&sh=1000",
  ];

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="product-detail-page">
      {/* Top Section: Images + Details */}
      <div className="product-top-section">
        {/* Images */}
        <div className="images-sidebar">
          {thumbnails.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb${idx + 1}`}
              className={`thumbnail ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className="main-image-wrapper">
          <img className="main-image" src={selectedImage} alt="Main Product" />
        </div>

        {/* Details */}
        <div className="product-info">
          <h2 className="product-title">Elegant Diamond Necklace</h2>
          <div className="rating-orders">
            <span className="star">⭐ 4.8</span>
            <span className="orders">(320 orders)</span>
          </div>
          <ul className="product-meta">
            <li><b>Made in:</b> Italy</li>
            <li><b>Design:</b> Classic & Timeless</li>
            <li><b>Delivery:</b> 3-5 days shipping</li>
          </ul>
          <div className="options-group">
            <div>
              <label className="option-label">Metal Type:</label>
              <div className="button-group">
                <button className="option-button active">Gold</button>
                <button className="option-button">Silver</button>
                <button className="option-button">Platinum</button>
              </div>
            </div>
            <div>
              <label className="option-label">Size:</label>
              <div className="button-group">
                <button className="option-button">Small</button>
                <button className="option-button active">Medium</button>
                <button className="option-button">Large</button>
              </div>
            </div>
            <div className="quantity-control">
              <button onClick={decrement}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={increment}>+</button>
            </div>
          </div>
          <div className="price">₹850.00</div>
          <div className="action-buttons">
            <button className="btn-add-cart">Add to cart</button>
            <button className="btn-buy-now">Buy now</button>
          </div>
         
          <div className="global-rating">
            <div className="rating-stars-row">
              <span className="star-icons">
                {/* 4 full stars, 1 half star */}
                <span style={{color:'#f7a707', fontSize:'1.5rem'}}>★</span>
                <span style={{color:'#f7a707', fontSize:'1.5rem'}}>★</span>
                <span style={{color:'#f7a707', fontSize:'1.5rem'}}>★</span>
                <span style={{color:'#f7a707', fontSize:'1.5rem'}}>★</span>
                <span style={{color:'#f7a707', fontSize:'1.5rem'}}>☆</span>
              </span>
              <span className="rating-number" style={{marginLeft:'8px', fontWeight:'700', fontSize:'1.1rem'}}>4.7 out of 5</span>
            </div>
            <div className="rating-count">458 global ratings</div>
            <div className="rating-bars">
              <div className="rating-bar-row">
                <span className="bar-label">5</span>
                <span className="bar-star">★</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{width:'90%'}}></div>
                </div>
              </div>
              <div className="rating-bar-row">
                <span className="bar-label">4</span>
                <span className="bar-star">★</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{width:'60%'}}></div>
                </div>
              </div>
              <div className="rating-bar-row">
                <span className="bar-label">3</span>
                <span className="bar-star">★</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{width:'40%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Full Width Below */}
      <div className="product-tabs-section">
        <div className="tabs">
          <button
            className={activeTab === "description" ? "tab active" : "tab"}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={activeTab === "reviews" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={activeTab === "company" ? "tab active" : "tab"}
            onClick={() => setActiveTab("company")}
          >
            Company
          </button>
          <button
            className={activeTab === "usage" ? "tab active" : "tab"}
            onClick={() => setActiveTab("usage")}
          >
            Usage guide
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="tab-card">
              <p>
                This elegant diamond necklace is crafted with the finest materials and designed to add a timeless sparkle to your look.
              </p>
              <p>Perfect for both everyday wear and special occasions.</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="reviews-list">
              <div className="review-card">
                <div className="review-author">Jane D.</div>
                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                <div className="review-text">
                  "Absolutely stunning piece! I get compliments every time I wear it."
                </div>
              </div>
              <div className="review-card">
                <div className="review-author">Mark S.</div>
                <div className="review-stars">⭐⭐⭐⭐☆</div>
                <div className="review-text">
                  "Great quality and design, but delivery was a bit slow."
                </div>
              </div>
            </div>
          )}
          {activeTab === "company" && (
            <div className="tab-card">
              <p>Gemstone Traders Inc. is a renowned jeweler specializing in fine diamond pieces.</p>
              <p>Established in Italy with over 20 years of experience.</p>
            </div>
          )}
          {activeTab === "usage" && (
            <div className="tab-card">
              <p>Wear this necklace with a simple dress or a blouse to add an elegant touch.</p>
              <p>Store in a jewelry box to avoid scratches.</p>
              <p>Clean gently with a soft cloth and avoid harsh chemicals.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products-section">
        <h3 className="related-title">Related Products</h3>
        <div className="related-products-list">
          {/* Example related products, replace with your data */}
          <div className="related-card">
            <img src="https://5.imimg.com/data5/TG/DN/MY-37294786/designer-artificial-jewellery.jpg" alt="Product 1" />
            <div className="related-name">Gold Earrings</div>
            <div className="related-price">₹650.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://5.imimg.com/data5/TG/DN/MY-37294786/designer-artificial-jewellery.jpg" alt="Product 2" />
            <div className="related-name">Diamond Ring</div>
            <div className="related-price">₹1,200.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          <div className="related-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtPWtIwSXil4ffkj9fMU8Ghum4bOhWEoBLJw&s" alt="Product 3" />
            <div className="related-name">Silver Bracelet</div>
            <div className="related-price">₹450.00</div>
            <button className="related-cart-btn">Add to cart</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
