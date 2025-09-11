// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
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
import AddCategory from "./components/AddCategory";
import EditCategory from "./components/EditCategory";
import DeleteCategory from "./components/DeleteCategory";
import EditCoupon from "./components/EditCoupon";
import AddCoupon from "./components/AddCoupon";
import DeleteCoupon from "./components/DeleteCoupon";
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
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/admin/edit-product" element={<EditProduct />} />
            <Route path="/admin/delete-product" element={<DeleteProduct />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/edit-category" element={<EditCategory />} />
            <Route path="/admin/delete-category" element={<DeleteCategory />} />
            <Route path="/admin/add-coupon" element={<AddCoupon />} />
            <Route path="/admin/edit-coupon" element={<EditCoupon />} />
            <Route path="/admin/delete-coupon" element={<DeleteCoupon />} />

            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
