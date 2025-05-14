import { Routes, Route } from "react-router-dom";
import ChildApp from "../pages/ChildPortal/ChildApp";
import ChildDashboard from "../pages/ChildPortal/pages/ChildDashboard";
import ChildBookpage from "../pages/ChildPortal/pages/ChildBookpage";
import ChildVideopage from "../pages/ChildPortal/pages/childVideopage";
import BookDetail from "../pages/ChildPortal/pages/components/BookDetail";

const ChildRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChildApp />}>
        <Route index element={<ChildDashboard />} />
        <Route path="book" element={<ChildBookpage />} />
        <Route path="/books/:slug" element={<BookDetail />} />
        <Route path="video" element={<ChildVideopage />} />

      </Route>
    </Routes>
  );
};

export default ChildRoutes;
