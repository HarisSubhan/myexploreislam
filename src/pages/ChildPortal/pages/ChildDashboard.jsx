import React from "react";
import VideoSlider from "./components/VideoSlider";
import Book from "./components/Book";

const ChildDashboard = () => {
  return (
    <div className="p-6">
      <Book />
      <VideoSlider />
    </div>
  );
};

export default ChildDashboard;
