import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const ChildApp = lazy(() => import("../pages/ChildPortal/ChildApp"));
const ChildDashboard = lazy(() => import("../pages/ChildPortal/pages/ChildDashboard"));
const ChildProfilePage = lazy(() => import("../pages/ChildPortal/pages/ChildProfilePage"));
const CartoonModules = lazy(() => import("../pages/ChildPortal/pages/CartoonModules"));
const VideoModules = lazy(() => import("../pages/ChildPortal/pages/VideoModules"));

const ChildRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="cartoons" element={<CartoonModules />} />
          <Route path="videos" element={<VideoModules />} />
          <Route path="profile" element={<ChildProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
