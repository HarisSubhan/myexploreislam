import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ModulePage1 from "../components/child/ModulePage1";
import ModuleQuiz from "../components/child/ModuleQuiz";
import ModuleCompletion from "../components/child/ModuleCompletion";
import SeriesDetail from "../components/child/SeriesDetail";

const ChildApp = lazy(() => import("../pages/ChildPortal/ChildApp"));
const ChildDashboard = lazy(
  () => import("../pages/ChildPortal/pages/ChildDashboard")
);
const ChildProfilePage = lazy(
  () => import("../pages/ChildPortal/pages/ChildProfilePage")
);
const CartoonModules = lazy(
  () => import("../pages/ChildPortal/pages/CartoonModules")
);
const VideoModules = lazy(
  () => import("../pages/ChildPortal/pages/VideoModules")
);
const NotificationPageChild = lazy(
  () => import("../pages/ChildPortal/pages/NotificationPageChild")
);
const HistoryPageChild = lazy(
  () => import("../pages/ChildPortal/pages/HistoryPageChild")
);
const HelpPageChild = lazy(
  () => import("../pages/ChildPortal/pages/HelpPageChild")
);
const VideoWatch = lazy(() => import("../components/child/VideoWatch"));

const ChildRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<ChildApp />}>
          {/* DASHBOARD & PROFILE */}
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />

          {/* DYNAMIC MODULE BROWSER */}
          <Route path="browse/:type" element={<CartoonModules />} />
          <Route path="browse/singles/:videoSlug" element={<VideoWatch />} />

          {/* SERIES ROUTES */}
          <Route path="series/:seriesSlug" element={<SeriesDetail />} />
          <Route
            path="series/:seriesSlug/video/:videoSlug"
            element={<VideoWatch />}
          />

          {/* LEGACY/COMPATIBILITY ROUTES */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />
          <Route path="series" element={<VideoModules />} />

          {/* OTHER PAGES */}
          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-Support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
