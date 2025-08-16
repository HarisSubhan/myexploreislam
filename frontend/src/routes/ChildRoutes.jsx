import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const ChildApp = lazy(() => import("../pages/ChildPortal/ChildApp"));
const ChildDashboard = lazy(() => import("../pages/ChildPortal/pages/ChildDashboard"));
const ChildProfilePage = lazy(() => import("../pages/ChildPortal/pages/ChildProfilePage"));
const CartoonModules = lazy(() => import("../pages/ChildPortal/pages/CartoonModules"));
const VideoModules = lazy(() => import("../pages/ChildPortal/pages/VideoModules"));
const NotificationPageChild = lazy(() => import("../pages/ChildPortal/pages/NotificationPageChild"));
const HistoryPageChild =  lazy(() => import("../pages/ChildPortal/pages/HistoryPageChild"));
const HelpPageChild = lazy(() => import("../pages/ChildPortal/pages/HelpPageChild"));
const VideoSeries = lazy(() => import("../components/child/VideoSeries"));
const VideoWatch = lazy(() => import("../components/child/VideoWatch"));
const ChildRoutes = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />
          <Route path="cartoon" element={<CartoonModules />} />
          <Route path="cartoon/series/:id" element={<VideoWatch />} />

          <Route path="module" element={<VideoModules />} />
          <Route path="module/series/:id" element={<VideoSeries />} />
          
          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-Support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
