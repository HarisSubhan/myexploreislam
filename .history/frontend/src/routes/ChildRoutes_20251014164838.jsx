import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ModulePage1 from "../components/child/ModulePage1";
import ModuleQuiz from "../components/child/ModuleQuiz";
import ModuleCompletion from "../components/child/ModuleCompletion";

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
const VideoSeries = lazy(() => import("../components/child/VideoSeries"));
const VideoWatch = lazy(() => import("../components/child/VideoWatch"));
const ModuleIntroduction = lazy(
  () => import("../components/child/ModuleIntroduction")
);

const ChildRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />
          {/* <Route path="series" element={<CartoonModules />} /> */}
          <Route path="cartoon/series/:id" element={<VideoWatch />} />

          {/* FIXED */}
          <Route path="series" element={<VideoModules />} />
          <Route path="series/series/:id" element={<VideoSeries />} />
          <Route
            path="series/series/:id/introduction"
            element={<ModuleIntroduction />}
          />
          <Route path="series/series/:id/page1" element={<ModulePage1 />} />
          <Route path="module/series/:id/quiz" element={<ModuleQuiz />} />
          <Route
            path="module/series/:id/completion"
            element={<ModuleCompletion />}
          />

          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-Support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
