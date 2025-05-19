import React from "react";
import ParentApp from "../pages/ParentPortal/ParentApp";

const ParentRoutes = () => {
  <Routes>
    <Route path="/" element={<ParentApp />}>
      {/* <Route index element={<ChildDashboard />} />
      <Route path="book" element={<ChildBookpage />} />
      <Route path="book/:bookId" element={<BookDetail />} /> */}
    </Route>
  </Routes>;
};

export default ParentRoutes;
