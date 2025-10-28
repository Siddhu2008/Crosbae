// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./components/AddProduct";
import AdminProducts from "./components/AdminProducts";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./components/WishlistPage";
import CartPage from "./pages/CartPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import FAQPage from "./pages/FAQPage";
import EditProduct from "./components/EditProduct";
import DeleteProduct from "./components/DeleteProduct";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import OrderTracking from "./pages/OrderTrackingPage";
import EditProfile from "./pages/EditProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import AddAddress from "./components/AddAddress";
import EditAddress from "./components/EditAddress";

import AOS from "aos";
import "aos/dist/aos.css";
import "./main.css"; 
import "./styles/Loader.css";
import { useLoader } from "./contexts/LoaderContext";

// Component to handle blur automatically on route change
const AppContent = () => {
  const { loading, showLoader, hideLoader } = useLoader();
  const location = useLocation();

  // Automatically show blur during route transitions
  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
    }, 300); // small delay to simulate loading
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={loading ? "blur-content" : ""}>
      <Navbar />
        <ScrollToTop />
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
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/admin/EditProduct" element={<EditProduct />} />
        <Route path="/admin/DeleteProduct" element={<DeleteProduct />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/orders/:id/tracking" element={<OrderTracking />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/edit-address/:id" element={<EditAddress />} />
      </Routes>
      <Footer />
    </div>
  );
};

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
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
};

export default App;
