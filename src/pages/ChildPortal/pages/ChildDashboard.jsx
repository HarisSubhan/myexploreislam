import React from "react";
import VideoSlider from "../../../components/child/VideoSlider";
import Book from "../../../components/child/Book";


const ChildDashboard = () => {
  return (
    <div className="p-6">
      <Book />
      <VideoSlider />
    </div>
  );
};

export default ChildDashboard;
