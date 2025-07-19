import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/SharedPortal/pages/LoginPage";
import HomePage from "../src/pages/SharedPortal/pages/HomePage";
import AdminRoutes from "../src/routes/AdminRoutes";
import ParentRoutes from "../src/routes/ParentRoutes";
import ChildRoutes from "../src/routes/ChildRoutes";
import StaticApp from "../src/pages/SharedPortal/StaticApp";
import Unauthorized from "./pages/SharedPortal/Unauthorized";
import BlogPage from "./pages/SharedPortal/pages/BlogPage";
import BlogDetail from  "./components/common/BlogDetail";
import RegisterPage from "./pages/SharedPortal/pages/RegisterPage";
import Subscription from "./pages/SharedPortal/pages/Subscription";
";

function RequireAuth({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StaticApp />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:titleSlug" element={<BlogDetail />} />
        </Route>

        {/* 👇 Protected routes */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminRoutes />
            </RequireAuth>
          }
        />
        <Route
          path="/parent/*"
          element={
            <RequireAuth allowedRoles={["parent"]}>
              <ParentRoutes />
            </RequireAuth>
          }
        />
        <Route
          path="/child/*"
          element={
            <RequireAuth allowedRoles={["child"]}>
              <ChildRoutes />
            </RequireAuth>
          }
        />

        {/* 👇 Login is separate — no layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
