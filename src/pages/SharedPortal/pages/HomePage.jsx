import React from "react";
import Header from "../../../components/common/Header";
import HeroSection from "../../../components/common/HeroSection";
import InteractiveLearning from "../../../components/common/InteractiveLearning";
import WhyChoose from "../../../components/common/WhyChoose";
import SubscriptionModel from "../../../components/common/SubscriptionModel";
import ExploreIslam from "../../../components/common/ExploreIslam";

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
