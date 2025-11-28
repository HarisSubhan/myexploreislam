import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Children from "../pages/ParentPortal/pages/Children";

import ParentalControls from "../pages/ParentPortal/pages/ParentalControls";
import ParentNotifications from "../pages/ParentPortal/pages/ParentNotifications";
import ParentSupports from "../pages/ParentPortal/pages/ParentSupports";


const ParentApp = lazy(() => import("../pages/ParentPortal/ParentApp"));
const ParentDashboard = lazy(() => import("../pages/ParentPortal/pages/ParentDashboard"));
const Subscription = lazy(() => import("../pages/ParentPortal/pages/Subscription"));
const DefaultTheme = lazy(() => import("../pages/ParentPortal/pages/DefaultTheme"));
const RequestChild = lazy(() => import("../components/parent/RequestChild"));

const ParentRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ParentApp />}>
          <Route index element={<ParentDashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="requests-child" element={<RequestChild />} />
          <Route path="subscriptions-billing" element={<Subscription />} />
          <Route path="parental-controls" element={<ParentalControls />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="support" element={<ParentSupports />} />
          <Route path="account-setting" element={<DefaultTheme />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ParentRoutes;
