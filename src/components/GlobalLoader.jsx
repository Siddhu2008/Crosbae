import React from "react";
import { useLocation } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useBrand } from "../contexts/BrandContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import { usePurity } from "../contexts/PurityContext";
import { useCertificate } from "../contexts/CertificateContext";
import { useCart } from "../contexts/CartContext";
import { useLoader } from "../contexts/LoaderContext";
import "../styles/Loader.css";

export default function GlobalLoader() {
  // contexts vary in how they expose state (some return `state`, some return state object directly)
  const prod = useProduct();
  const brand = useBrand();
  const cat = useCategory();
  const metal = useMetalType();
  const stone = useStoneType();
  const purity = usePurity();
  const cert = useCertificate();
  const cart = useCart();
  const { loading: routeLoading } = useLoader();
  const location = useLocation();
  const path = (location.pathname || "").toLowerCase();

  const candidates = [
    prod?.state?.loading ?? prod?.loading,
    brand?.loading ?? brand?.state?.loading,
    cat?.loading ?? cat?.state?.loading,
    metal?.state?.loading ?? metal?.loading,
    stone?.state?.loading ?? stone?.loading,
    purity?.state?.loading ?? purity?.loading,
    cert?.state?.loading ?? cert?.loading,
    cart?.loading,
    routeLoading,
  ];

  const isAnyLoading = candidates.some((v) => !!v);
  if (!isAnyLoading) return null;

  // site-specific skeletons below. We render different skeletons depending on route
  const navbarSkeleton = () => (
    <div className="navbar-sk-skeleton">
      <div className="navbar-sk-container">
        <div className="navbar-sk-logo shimmer" />
        <div className="navbar-sk-links">
          <div className="nav-sk-link shimmer" />
          <div className="nav-sk-link shimmer" />
          <div className="nav-sk-link shimmer" />
          <div className="nav-sk-link shimmer" />
        </div>
        <div className="navbar-sk-actions">
          <div className="action-sk-icon shimmer" />
          <div className="action-sk-icon shimmer" />
          <div className="action-sk-icon shimmer" />
        </div>
      </div>
    </div>
  );

  const homeSkeleton = () => (
    <div className="home-skeleton-page">
      {navbarSkeleton()}
      <div className="brand-cats">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="cat-item" key={i}>
            <div className="cat-thumb shimmer" />
            <div className="cat-label shimmer" />
          </div>
        ))}
      </div>

      <div className="brand-hero">
        <div className="hero-card">
          <div className="hero-title shimmer" />
          <div className="hero-sub shimmer" />
        </div>
      </div>

      <div className="brand-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="grid-card" key={i}>
            <div className="grid-img shimmer" />
            <div className="grid-line shimmer" />
            <div className="grid-line shimmer small" />
          </div>
        ))}
      </div>
    </div>
  );



  const productListSkeleton = () => (
    <div className="list-skeleton-page">
      {navbarSkeleton()}
      <div className="list-skeleton grid-skeleton shop-skeleton">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-img shimmer" />
            <div className="skeleton-title shimmer" />
            <div className="skeleton-price shimmer" />
            <div className="skeleton-btn shimmer" />
          </div>
        ))}
      </div>
    </div>
  );



  const collectionSkeleton = () => (
    <div className="collection-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="collection-title shimmer" />
      <div className="collection-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="collection-card-skeleton" key={i}>
            <div className="collection-img-skeleton shimmer" />
            <div className="collection-label-skeleton shimmer" />
          </div>
        ))}
      </div>
    </div>
  );


  const wishlistSkeleton = () => (
    <div className="list-skeleton grid-skeleton shop-skeleton">
      {navbarSkeleton()}
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-img shimmer" />
          <div className="skeleton-title shimmer" />
          <div className="skeleton-price shimmer" />
          <div className="skeleton-btn shimmer" />
        </div>
      ))}
    </div>
  );

  const cartSkeleton = () => (
    <div className="cart-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="cart-skeleton-content">
        {/* Left Side - Cart Items */}
        <div className="cart-items-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="cart-item-skeleton" key={i}>
              <div className="cart-img-skeleton shimmer" />
              <div className="cart-info-skeleton">
                <div className="cart-title-skeleton shimmer" />
                <div className="cart-sku-skeleton shimmer" />
                <div className="cart-price-skeleton shimmer" />
                <div className="cart-qty-skeleton">
                  <div className="qty-btn-skeleton shimmer" />
                  <div className="qty-num-skeleton shimmer" />
                  <div className="qty-btn-skeleton shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Order Summary */}
        <div className="order-summary-skeleton">
          <div className="summary-line-skeleton shimmer long" />
          <div className="summary-line-skeleton shimmer" />
          <div className="summary-line-skeleton shimmer short" />
          <div className="summary-total-skeleton shimmer" />
          <div className="summary-btn-skeleton shimmer" />
        </div>
      </div>
    </div>
  );


  const profileSkeleton = () => (
    <div className="profile-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="profile-card-skeleton">
        <div className="profile-avatar-skeleton shimmer" />
        <div className="profile-name-skeleton shimmer" />
        <div className="profile-email-skeleton shimmer" />

        <div className="profile-details-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="profile-line-skeleton shimmer" key={i} />
          ))}
        </div>

        <div className="address-section-skeleton">
          <div className="address-title-skeleton shimmer" />
          <div className="address-line-skeleton shimmer" />
          <div className="address-line-skeleton shimmer short" />
          <div className="address-buttons-skeleton">
            <div className="address-btn-skeleton shimmer" />
            <div className="address-btn-skeleton shimmer" />
          </div>
        </div>
      </div>
    </div>
  );


  const formSkeleton = () => (
    <div className="form-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="form-header-skeleton">
        <div className="form-title-skeleton shimmer" />
        <div className="form-subtitle-skeleton shimmer" />
      </div>

      <div className="form-body-skeleton">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="form-field-skeleton shimmer" key={i} />
        ))}

        <div className="form-button-skeleton shimmer" />
      </div>
    </div>
  );

  const ordersSkeleton = () => (
    <div className="orders-skeleton-wrapper">
      {navbarSkeleton()}
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="order-card-skeleton" key={i}>
          {/* Header */}
          <div className="order-header-skeleton">
            <div className="order-id-skeleton shimmer" />
            <div className="order-date-skeleton shimmer" />
            <div className="order-status-skeleton shimmer" />
            <div className="order-total-skeleton shimmer" />
          </div>

          {/* Progress bar */}
          <div className="order-progress-skeleton shimmer" />

          {/* Product Items */}
          <div className="order-items-skeleton">
            {Array.from({ length: 2 }).map((_, j) => (
              <div className="order-item-skeleton" key={j}>
                <div className="order-thumb-skeleton shimmer" />
                <div className="order-lines-skeleton">
                  <div className="order-line-skeleton shimmer" />
                  <div className="order-line-skeleton shimmer short" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="order-buttons-skeleton">
            <div className="order-btn-skeleton shimmer" />
            <div className="order-btn-skeleton shimmer" />
            <div className="order-btn-skeleton shimmer wide" />
          </div>
        </div>
      ))}
    </div>
  );
  const contactSkeleton = () => (
    <div className="contact-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="contact-header-skeleton">
        <div className="contact-title-skeleton shimmer" />
        <div className="contact-subtitle-skeleton shimmer" />
      </div>

      <div className="contact-body-skeleton">
        {/* Left - Contact Info */}
        <div className="contact-info-skeleton">
          <div className="info-line-skeleton shimmer long" />
          <div className="info-line-skeleton shimmer" />
          <div className="info-line-skeleton shimmer" />
          <div className="info-line-skeleton shimmer short" />
        </div>

        {/* Right - Message Form */}
        <div className="contact-form-skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="form-input-skeleton shimmer" key={i} />
          ))}
          <div className="form-button-skeleton shimmer" />
        </div>
      </div>
    </div>
  );
  const aboutSkeleton = () => (
    <div className="about-skeleton-wrapper">
      {navbarSkeleton()}
      <div className="about-header-skeleton">
        <div className="about-title-skeleton shimmer" />
        <div className="about-subtitle-skeleton shimmer" />
      </div>

      <div className="about-story-skeleton">
        <div className="story-title-skeleton shimmer" />
        <div className="story-line-skeleton shimmer long" />
        <div className="story-line-skeleton shimmer" />
        <div className="story-line-skeleton shimmer short" />
      </div>

      <div className="mission-vision-skeleton">
        <div className="mv-card-skeleton shimmer" />
        <div className="mv-card-skeleton shimmer" />
      </div>
    </div>
  );

  // choose skeleton by route. default to home skeleton
  const chooseSkeleton = () => {
    if (path === "/" || path === "") return homeSkeleton();

    if (path.startsWith("/shop")) return productListSkeleton();
    if (path.startsWith("/collections")) return collectionSkeleton();

    if (path.startsWith("/about")) return aboutSkeleton();
    if (path.startsWith("/contact")) return contactSkeleton();

    if (path.startsWith("/wishlist")) return wishlistSkeleton();
    if (path.startsWith("/cart")) return cartSkeleton();

    if (path.startsWith("/profile") || path.startsWith("/account")) return profileSkeleton();

    if (
      path.startsWith("/add-address") ||
      path.startsWith("/edit-address") ||
      path.startsWith("/admin/add-product") ||
      path.startsWith("/admin/edit-profile") ||
      path.startsWith("/admin/edit-product")
    )
      return formSkeleton();

    if (
      path.startsWith("/orders") ||
      path.startsWith("/order-history") ||
      path.startsWith("/orders/")
    )
      return ordersSkeleton();

    // fallback
    return homeSkeleton();
  };



  return (
    <div className="global-loader-overlay brand-overlay" aria-hidden={!isAnyLoading}>
      <div className="global-loader-skeleton brand-full">{chooseSkeleton()}</div>
    </div>
  );
}
