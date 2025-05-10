import React from "react";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ExploreIslam from "../components/ExploreIslam";
import InteractiveLearning from "../components/InteractiveLearning";
import WhyChoose from "../components/WhyChoose";
import SubscriptionModel from "../components/SubscriptionModel";

const Home = () => (
  <>
    <Header />
    <HeroSection />
    <InteractiveLearning />
    <ExploreIslam />
    <WhyChoose />
    <SubscriptionModel />
  </>
);

export default Home;
