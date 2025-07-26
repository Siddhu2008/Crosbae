import React from "react";
import TopCategory from "../components/topCategory";
import HeroSection from "../components/heroSection";
import TrandingNow from "../components/trandingItems";
import NewArrivals from "../components/NewArrivals";
import MatchForYou from "../components/MatchForYou";
import CustomerReviews from "../components/CustomerReviews";
import ShopServices from "../components/ShopServices";
import OccupationSection from "../components/OccupationSection";

export default function HomePage() {
  return (
    <>
      <TopCategory />
      <HeroSection />
      <TrandingNow />
      <NewArrivals />
      <MatchForYou />
      <ShopServices />
      <OccupationSection />
      <CustomerReviews />
    </>
  );
}
