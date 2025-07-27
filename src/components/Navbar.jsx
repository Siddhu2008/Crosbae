import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css"
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount] = useState(3);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar sticky-top">
      <div className="navbar-container">
        {/* Logo */}
       
          <Link to="/" className="logo" data-aos="fade-up">
            <img src={logo} alt="Cros Bae Logo" />
          </Link>
        
        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Admin</Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search jewelry..." />
          <i className="fas fa-search search-icon"></i>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <Link to="/wishlist" aria-label="Wishlist">
            <i className="far fa-heart"></i>
          </Link>
          <Link to="/login" aria-label="Login">
            <i className="far fa-user"></i>
          </Link>
          <Link to="/cart" className="cart-icon" aria-label="Cart">
            <i className="fas fa-shopping-bag"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
