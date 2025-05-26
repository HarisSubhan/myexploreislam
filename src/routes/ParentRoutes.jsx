import React from "react";

import ParentDashboard from "../pages/ParentPortal/pages/ParentDashboard";
import { Route, Routes } from "react-router-dom";
import ParentApp from "../pages/ParentPortal/ParentApp";
import Subscription from "../pages/ParentPortal/pages/Subscription";
import Payments from "../pages/ParentPortal/pages/Payments";
import Profile from "../pages/ParentPortal/pages/Profile";
import ChangePassword from "../pages/ParentPortal/pages/ChangePassword";
import DefaultTheme from "../pages/ParentPortal/pages/DefaultTheme";
// import { ThemeProvider } from "../context/ThemeContext";

const ParentRoutes = () => {
  return (
    // <ThemeProvider>
      <Routes>
        <Route path="/" element={<ParentApp />}>
          <Route index element={<ParentDashboard />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="defaulttheme" element={<DefaultTheme />} />
        </Route>
      </Routes>
    // </ThemeProvider>
  );
};

export default ParentRoutes;