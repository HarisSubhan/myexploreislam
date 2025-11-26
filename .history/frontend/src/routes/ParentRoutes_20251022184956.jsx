import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Children from "../pages/ParentPortal/pages/Children";
import ParentalControls from "../pages/ParentPortal/pages/ParentalControls";
import ParentNotifications from "../pages/ParentPortal/pages/ParentNotifications";
import ParentSupports from "../pages/ParentPortal/pages/ParentSupports";

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
const RequestChild = lazy(() => import("../components/parent/RequestChild"));

const ParentRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ParentApp />}>
          <Route index element={<ParentDashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="requests-child" element={<RequestChild />} />
          <Route path="learning-reports" element={<LearningReports />} />
          <Route path="subscriptions-billing" element={<Subscription />} />
          <Route path="parental-controls" element={<ParentalControls />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="support" element={<ParentSupports />} />
          <Route path="account-setting" element={<DefaultTheme />} />

          {/* <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="addchild" element={<AddChild />} />
          <Route path="defaulttheme" element={<DefaultTheme />} /> */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ParentRoutes;
