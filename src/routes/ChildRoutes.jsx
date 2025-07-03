import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const ChildApp = lazy(() => import("../pages/ChildPortal/ChildApp"));
const ChildDashboard = lazy(() => import("../pages/ChildPortal/pages/ChildDashboard"));
const ChildBookpage = lazy(() => import("../pages/ChildPortal/pages/ChildBookpage"));
const BookDetail = lazy(() => import("../components/child/BookDetail"));
const ChildVideopage = lazy(() => import("../pages/ChildPortal/pages/ChildVideopage"));
const VideoDetail = lazy(() => import("../components/child/VideoDetail"));
const QuizPage = lazy(() => import("../pages/ChildPortal/pages/QuizPage"));
const QuizStart = lazy(() => import("../components/child/QuizStart"));
const AssignmentsPage = lazy(() => import("../pages/ChildPortal/pages/AssignmentsPage"));
const AssignmentsStart = lazy(() =>import("../components/child/AssignmentsStart"));

const ChildRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="book" element={<ChildBookpage />} />
          <Route path="book/:bookId" element={<BookDetail />} />
          <Route path="video" element={<ChildVideopage />} />
          <Route path="video/:videoId" element={<VideoDetail />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="quiz/:quizid" element={<QuizStart />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="assignments/:id" element={<AssignmentsStart />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ChildRoutes;
