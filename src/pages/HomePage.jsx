import React from "react";
import TopCategory from "../components/topCategory";
import HeroSection from "../components/heroSection";
import TrandingNow from "../components/trandingItems";
import NewArrivals from "../components/NewArrivals";
import MatchForYou from "../components/MatchForYou";
import CustomerReviews from "../components/CustomerReviews";
import ShopServices from "../components/ShopServices";
import OccupationSection from "../components/OccupationSection";
import Seo from "../components/Seo";
import FAQ from "../components/FAQ";

export default function HomePage() {
  return (
    <>
      <Seo
        title="Home"
        description="Discover timeless elegance with Cros Bae's exquisite collection of imitation jewellery. Shop for rings, necklaces, earrings and more."
        keywords="imitation jewellery, fashion jewellery, online jewellery shopping"
      />
      <TopCategory />
      <HeroSection />
      <TrandingNow />
      <NewArrivals />
      <MatchForYou />
      <ShopServices />
      <OccupationSection />
      <CustomerReviews />
      <FAQ />
    </>
  );
}
