import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ModulePage1 from "../components/child/ModulePage1";
import ModuleQuiz from "../components/child/ModuleQuiz";
import ModuleCompletion from "../components/child/ModuleCompletion";
import SeriesDetail from "../components/child/SeriesDetail";
import SeriesQuizDetail from "../components/child/SeriesQuizDetail";

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
          <Route path="browse/:type" element={<CartoonModules />} />
          <Route path="series/:seriesSlug" element={<SeriesDetail />} />
          <Route path="browse/singles/:videoSlug" element={<VideoWatch />} />
          <Route
            path="series/:seriesSlug/video/:videoSlug"
            element={<VideoWatch />}
          />
          {/* ✅ FIXED: MODULE ROUTES */}
          // In ChildRoutes.js - Fix the single video routes
          <Route path="module">
            <Route index element={<VideoModules />} />

            {/* ✅ SERIES MODULE FLOW */}
            <Route path=":seriesSlug" element={<SeriesQuizDetail />} />
            <Route
              path=":seriesSlug/introduction"
              element={<ModuleIntroduction />}
            />
            <Route
              path=":seriesSlug/page1/:videoId?"
              element={<ModulePage1 />}
            />
            <Route path=":seriesSlug/quiz/:videoId?" element={<ModuleQuiz />} />
            <Route
              path=":seriesSlug/completion/:videoId?"
              element={<ModuleCompletion />}
            />

            {/* ✅ SINGLE VIDEO MODULE FLOW - FIXED ROUTES */}
            <Route path="single">
              <Route
                path=":videoId/introduction"
                element={<ModuleIntroduction />}
              />
              <Route path=":videoId/page1" element={<ModulePage1 />} />
              <Route path=":videoId/quiz" element={<ModuleQuiz />} />
              <Route
                path=":videoId/completion"
                element={<ModuleCompletion />}
              />
            </Route>
          </Route>
          {/* BACKWARD COMPATIBLE ROUTES */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
