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
          {/* DASHBOARD & PROFILE */}
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />

          {/* BROWSE CONTENT */}
          <Route path="browse/:type" element={<CartoonModules />} />
          <Route path="browse/singles/:videoSlug" element={<VideoWatch />} />

          {/* SERIES CONTENT */}
          <Route path="series" element={<VideoModules />} />
          <Route path="series/:seriesSlug" element={<SeriesDetail />} />
          <Route
            path="series/:seriesSlug/video/:videoSlug"
            element={<VideoWatch />}
          />

          {/* MODULE LEARNING PATH */}
<Route
  path="module/series/:seriesId/introduction"
  element={<ModuleIntroduction />}
/>
{/* ADD THIS NEW ROUTE */}
<Route
  path="module/single/:videoId/introduction"
  element={<ModuleIntroduction />} // You might want a different component for single videos
/>
<Route
  path="module/series/:seriesId/page1"
  element={<ModulePage1 />}
/>
<Route path="module/series/:seriesId/quiz" element={<ModuleQuiz />} />
<Route
  path="module/series/:seriesId/completion"
  element={<ModuleCompletion />}
/>

          {/* MODULE LEARNING PATH */}
          <Route
            path="module/series/:seriesId/introduction"
            element={<ModuleIntroduction />}
          />
          <Route
            path="module/series/:seriesId/page1"
            element={<ModulePage1 />}
          />
          <Route path="module/series/:seriesId/quiz" element={<ModuleQuiz />} />
          <Route
            path="module/series/:seriesId/completion"
            element={<ModuleCompletion />}
          />

          {/* BACKWARD COMPATIBLE ROUTES */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />

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
