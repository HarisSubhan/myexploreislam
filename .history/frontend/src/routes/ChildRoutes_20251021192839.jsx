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
const ModuleIntroduction = lazy(
  () => import("../components/child/ModuleIntroduction")
);

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
         
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />

          {/* CONTENT BROWSING */}
          <Route path="browse/:type" element={<CartoonModules />} />

          <Route path="series/:seriesSlug" element={<SeriesDetail />} />

          {/* VIDEO PLAYBACK - SINGLE & SERIES */}
          <Route path="browse/singles/:videoSlug" element={<VideoWatch />} />
          <Route
            path="series/:seriesSlug/video/:videoSlug"
            element={<VideoWatch />}
          />

          {/* ✅ CORRECTED MODULE LEARNING PATH */}
          <Route path="module">
            {/* VideoModules as index route for /module */}
            <Route index element={<VideoModules />} />

            {/* SERIES MODULE FLOW */}
            <Route path="series/:seriesId">
              <Route index element={<ModuleIntroduction />} />{" "}
              {/* Optional: default route */}
              <Route path="introduction" element={<ModuleIntroduction />} />
              <Route path="page1" element={<ModulePage1 />} />
              <Route path="quiz" element={<ModuleQuiz />} />
              <Route path="completion" element={<ModuleCompletion />} />
            </Route>

            {/* SINGLE VIDEO MODULE FLOW */}
            <Route path="single/:videoId">
              <Route index element={<ModuleIntroduction />} />{" "}
              {/* Optional: default route */}
              <Route path="introduction" element={<ModuleIntroduction />} />
              <Route path="page1" element={<ModulePage1 />} />
              <Route path="quiz" element={<ModuleQuiz />} />
              <Route path="completion" element={<ModuleCompletion />} />
            </Route>
          </Route>

          {/* BACKWARD COMPATIBLE ROUTES */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />

          {/* OTHER PAGES */}
          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
