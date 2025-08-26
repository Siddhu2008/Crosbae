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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./main.css"; // Global styles
import AOS from "aos";
import "aos/dist/aos.css";
import WishlistPage from "./components/WishlistPage";
import CartPage from "./pages/CartPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import FAQ from "./pages/FAQ";
import EditProduct from "./components/EditProduct";
import DeleteProduct from "./components/DeleteProduct";
import CheckoutPage from "./components/CheckoutPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin/EditProduct" element={<EditProduct />} />
          <Route path="/admin/DeleteProduct" element={<DeleteProduct />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );

};

export default App;
