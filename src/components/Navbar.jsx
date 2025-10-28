import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const isLoggedIn = !!(user || localStorage.getItem("access"));

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) navigate("/login");
    else navigate(path);
  };

  return (
    <nav className="navbar royal-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" data-aos="fade-up" aria-label="Home">
          <img src={logo} alt="Cros Bae Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/collections" className="nav-link">Collections</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search jewelry..." aria-label="Search jewelry" />
          <i className="fas fa-search search-icon"></i>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          {/* Wishlist */}
          <button
            className="icon-link border-0 bg-transparent"
            onClick={() => handleProtectedClick("/wishlist")}
            aria-label="Wishlist"
          >
            <i className="far fa-heart"></i>
          </button>

          {/* Login/Register or Profile/Orders */}
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="border-0 bg-transparent icon-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="far fa-user"></i>
              </button>
              <ul className="dropdown-menu">
                <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                <li><Link to="/orders" className="dropdown-item">Order History</Link></li>
                <li>
                  <button className="dropdown-item btn btn-link text-start" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="dropdown">
              <button className="border-0 bg-transparent icon-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="far fa-user"></i>
              </button>
              <ul className="dropdown-menu">
                <li><Link to="/login" className="dropdown-item">Login</Link></li>
                <li><Link to="/register" className="dropdown-item">Register</Link></li>
              </ul>
            </div>
          )}

          {/* Cart Icon */}
          <button
            className="cart-icon icon-link border-0 bg-transparent"
            onClick={() => handleProtectedClick("/cart")}
            aria-label="Cart"
          >
            <i className="fas fa-shopping-bag"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Hamburger for Mobile */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu" aria-expanded={isOpen}>
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <input type="text" placeholder="Search jewelry..." className="mobile-search" aria-label="Mobile Search jewelry" />
          <Link to="/shop" onClick={toggleMenu}>Shop</Link>
          <Link to="/collections" onClick={toggleMenu}>Collections</Link>
          <Link to="/about" onClick={toggleMenu}>About</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>

          {/* Mobile auth links */}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={toggleMenu}>Profile</Link>
              <Link to="/orders" onClick={toggleMenu}>Order History</Link>
              <button className="btn btn-link mobile-logout" onClick={() => { toggleMenu(); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/register" onClick={toggleMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
