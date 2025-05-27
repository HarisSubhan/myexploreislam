import React from "react";
import ParentDashboard from "../pages/ParentPortal/pages/ParentDashboard";
import { Route, Routes } from "react-router-dom";
import ParentApp from "../pages/ParentPortal/ParentApp";
import Subscription from "../pages/ParentPortal/pages/Subscription";
import Payments from "../pages/ParentPortal/pages/Payments";
import Profile from "../pages/ParentPortal/pages/Profile";
import ChangePassword from "../pages/ParentPortal/pages/ChangePassword";
import DefaultTheme from "../pages/ParentPortal/pages/DefaultTheme";
import AddChild from './../pages/ParentPortal/pages/AddChild';
import Account from './../pages/ParentPortal/pages/Account';

const ParentRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<ParentApp />}>
          <Route index element={<ParentDashboard />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="payments" element={<Payments />} />
          <Route path="account" element={<Account />} />
          <Route path="profile" element={<Profile />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="addchild" element={<AddChild />} />
          <Route path="defaulttheme" element={<DefaultTheme />} />
        </Route>
      </Routes>
  );
};

export default ParentRoutes;