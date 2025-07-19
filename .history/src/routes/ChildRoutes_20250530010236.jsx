import { Routes, Route } from "react-router-dom";
import ChildApp from "../pages/ChildPortal/ChildApp";
import ChildDashboard from "../pages/ChildPortal/pages/ChildDashboard";
import ChildBookpage from "../pages/ChildPortal/pages/ChildBookpage";
import BookDetail from "../components/child/BookDetail";
import ChildVideopage from "../pages/ChildPortal/pages/ChildVideopage";
import VideoDetail from "../components/child/VideoDetail";
import QuizPage from "../pages/ChildPortal/pages/QuizPage";
import AssignmentsPage from "../pages/ChildPortal/pages/AssignmentsPage";
import QuizStart from "../components/child/QuizStart";

const ChildRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChildApp />}>
        <Route index element={<ChildDashboard />} />
        <Route path="book" element={<ChildBookpage />} />
        <Route path="book/:bookId" element={<BookDetail />} />
        <Route path="video" element={<ChildVideopage />} />
        <Route path="video/:videoId" element={<VideoDetail />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/:quizid" element={<QuizStart/>} />
        <Route path="assignments" element={<AssignmentsPage />} />
      </Route>
    </Routes>
  );
};

export default ChildRoutes;
