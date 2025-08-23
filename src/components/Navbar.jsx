import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // login and logout

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const getInitialCartCount = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      return storedCart.reduce((acc, item) => acc + item.quantity, 0);
    } catch (err) {
      return 0; // in case of JSON parse error
    }
  };

  const [cartCount, setCartCount] = useState(getInitialCartCount);


useEffect(() => {
  const updateCartCount = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalQuantity = storedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (err) {
      setCartCount(0);
    }
  };

  updateCartCount(); // initial check

  window.addEventListener("storage", updateCartCount);

  return () => window.removeEventListener("storage", updateCartCount);
}, []);



  return (
    <nav className="navbar royal-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" data-aos="fade-up" aria-label="Home">
          <img src={logo} alt="Cros Bae Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link to="/shop" className="nav-link">
            Shop
          </Link>
          <Link to="/collections" className="nav-link">
            Collections
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jewelry..."
            aria-label="Search jewelry"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <Link to="/wishlist" aria-label="Wishlist" className="icon-link">
            <i className="far fa-heart"></i>
          </Link>

          {/* Login/Register or Profile based on login */}
          {!isLoggedIn ? (
            <div className="dropdown">
              <button
                className="border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="far fa-user"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/login" className="dropdown-item">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="dropdown-item">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="border-0 bg-transparent"
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <i className="far fa-user"></i>
            </button>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="cart-icon icon-link"
            aria-label="Cart"
            style={{ position: "relative" }}
          >
            <i className="fas fa-shopping-bag"></i>
            <span className={`cart-badge ${cartCount === 0 ? "empty" : ""}`}>{cartCount}</span>

          </Link>

          {/* Hamburger for Mobile */}
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <input
            type="text"
            placeholder="Search jewelry..."
            className="mobile-search"
            aria-label="Mobile Search jewelry"
          />
          <Link to="/shop" onClick={toggleMenu}>
            Shop
          </Link>
          <Link to="/collections" onClick={toggleMenu}>
            Collections
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>
          <Link to="/admin" onClick={toggleMenu}>
            Admin
          </Link>
          <Link to="/wishlist" onClick={toggleMenu}>
            Wishlist
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
