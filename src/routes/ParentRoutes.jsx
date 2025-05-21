import React from "react";
import ParentApp from "../pages/ParentPortal/ParentApp";
import ParentDashboard from "../pages/ParentPortal/ParentDashboard";
import { Route, Routes } from "react-router-dom";

const ParentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ParentApp />}>
        <Route index element={<ParentDashboard />} />
        {/* Add more child routes here as needed */}
        {/* Example:
        <Route path="profile" element={<ParentProfile />} />
        <Route path="settings" element={<ParentSettings />} />
        */}
      </Route>
    </Routes>
  );
};

export default ParentRoutes;