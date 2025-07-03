import React from "react";
import BookHomepage from "../../../components/child/Bookhomepage";
import BookBanner from "../../../components/child/BookBanner";

const ChildBookpage = () => {
  return (
    <div className="p-6">
      <BookBanner />
     <BookHomepage/>
    </div>
  );
};

export default ChildBookpage;
