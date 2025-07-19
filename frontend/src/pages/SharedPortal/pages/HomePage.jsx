import React from "react";
import HeroSection from "../../../components/common/HeroSection";
import InteractiveLearning from "../../../components/common/InteractiveLearning";
import WhyChoose from "../../../components/common/WhyChoose";
import SubscriptionModel from "../../../components/common/SubscriptionModel";
import ExploreIslam from "../../../components/common/ExploreIslam";
import HowItWorks from "../../../components/common/HowItWorks";
import Blog from "../../../components/common/Blog";


const HomePage = () => {
  return (
    <>
  
      <HeroSection />
      <InteractiveLearning />
      <ExploreIslam />
      <WhyChoose />
      <SubscriptionModel />
      <HowItWorks/>
      <Blog/>
    </>
  );
};

export default HomePage;
