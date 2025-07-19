import { Routes, Route } from "react-router-dom";
import ChildApp from "../pages/ChildPortal/ChildApp";
import ChildDashboard from "../pages/ChildPortal/pages/ChildDashboard";
import ChildBookpage from "../pages/ChildPortal/pages/ChildBookpage";
import BookDetail from "../components/child/BookDetail";
import ChildVideopage from "../pages/ChildPortal/pages/ChildVideopage";
import VideoDetail from "../components/child/VideoDetail";
import QuizPage from "../pages/ChildPortal/pages/QuizPage";

const ChildRoutes = () => {
  return (
    <ThemeProvider></ThemeProvider>
    <Routes>
      <Route path="/" element={<ChildApp />}>
        <Route index element={<ChildDashboard />} />
        <Route path="book" element={<ChildBookpage />} />
        <Route path="book/:bookId" element={<BookDetail />} />
        <Route path="video" element={<ChildVideopage />} />
        <Route path="video/:videoId" element={<VideoDetail />} />
        <Route path="quiz" element={<QuizPage />} />
      </Route>
    </Routes>
  );
};

export default ChildRoutes;
