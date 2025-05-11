import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import InteractiveLearning from "../components/InteractiveLearning";
import ExploreIslam from "../components/ExploreIslam";
import WhyChoose from "../components/WhyChoose";
import SubscriptionModel from "../components/SubscriptionModel";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <InteractiveLearning />
      <ExploreIslam />
      <WhyChoose />
      <SubscriptionModel />
    </>
  );
};

export default HomePage;
