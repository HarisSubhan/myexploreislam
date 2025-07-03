import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy-loaded components
const ParentApp = lazy(() => import("../pages/ParentPortal/ParentApp"));
const ParentDashboard = lazy(() => import("../pages/ParentPortal/pages/ParentDashboard"));
const Subscription = lazy(() => import("../pages/ParentPortal/pages/Subscription"));
const Payments = lazy(() => import("../pages/ParentPortal/pages/Payments"));
const Profile = lazy(() => import("../pages/ParentPortal/pages/Profile"));
const ChangePassword = lazy(() => import("../pages/ParentPortal/pages/ChangePassword"));
const DefaultTheme = lazy(() => import("../pages/ParentPortal/pages/DefaultTheme"));
const AddChild = lazy(() => import("../pages/ParentPortal/pages/AddChild"));
const Account = lazy(() => import("../pages/ParentPortal/pages/Account"));

const ParentRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default ParentRoutes;
