// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage"
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./components/AddProduct";
import AdminProducts from "./components/AdminProducts";
import Footer from "./components/Footer";

import "./main.css"; // Global styles
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      mirror: false,
      duration: 800,
      easing: "ease-out-back",
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListingPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );

};

export default App;
