import React from "react";
import { useProduct } from "../contexts/ProductContext";
import { useBrand } from "../contexts/BrandContext";
import { useCategory } from "../contexts/CategoryContext";
import { useMetalType } from "../contexts/MetalTypeContext";
import { useStoneType } from "../contexts/StoneTypeContext";
import { usePurity } from "../contexts/PurityContext";
import { useCertificate } from "../contexts/CertificateContext";
import { useCart } from "../contexts/CartContext";
import { useLoader } from "../contexts/LoaderContext";
import { useLocation } from "react-router-dom";
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

  const path = location.pathname || "/";

  const productSkeleton = () => (
    <div className="skeleton-product">
      <div className="skeleton-thumb" />
      <div className="skeleton-product-details">
        <div className="skeleton-line big" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line small" />
        <div className="skeleton-row">
          <div className="skeleton-rect" style={{ width: 120, height: 40 }} />
          <div className="skeleton-rect" style={{ width: 180, height: 40 }} />
        </div>
        <div className="skeleton-grid-row">
          <div className="skeleton-box" />
          <div className="skeleton-box" />
          <div className="skeleton-box" />
        </div>
      </div>
    </div>
  );

  const gridSkeleton = (count = 8) => (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-card-img" />
          <div className="skeleton-line" style={{ width: "70%" }} />
          <div className="skeleton-line" style={{ width: "50%" }} />
        </div>
      ))}
    </div>
  );

  const genericSkeleton = () => (
    <div className="skeleton-generic">
      <div className="skeleton-line big" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line small" />
    </div>
  );

  // Render a centered site-style skeleton (two stacked rounded cards + small lines)
  const siteSkeleton = () => (
    <div className="brand-skeleton">
      {/* Header */}
      <div className="brand-header">
        <div className="brand-logo" />
        <div className="brand-nav">
          <div className="nav-item" />
          <div className="nav-item" />
          <div className="nav-item" />
          <div className="nav-item small" />
        </div>
        <div className="brand-actions">
          <div className="action-icon" />
          <div className="action-icon" />
          <div className="action-cart" />
        </div>
      </div>

      {/* Top categories - horizontal scroll of circles */}
      <div className="brand-cats">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="cat-item" key={i}>
            <div className="cat-thumb" />
            <div className="cat-label" />
          </div>
        ))}
      </div>

      {/* Hero banner */}
      <div className="brand-hero">
        <div className="hero-card">
          <div className="hero-title" />
          <div className="hero-sub" />
        </div>
      </div>

      {/* Small product grid hint below */}
      <div className="brand-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="grid-card" key={i}>
            <div className="grid-img" />
            <div className="grid-line" />
            <div className="grid-line small" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="global-loader-overlay brand-overlay" aria-hidden={!isAnyLoading}>
      <div className="global-loader-skeleton brand-full">{siteSkeleton()}</div>
    </div>
  );
}
