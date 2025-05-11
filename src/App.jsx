import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ParentRoutes from "./routes/ParentRoutes";
import ChildRoutes from "./routes/ChildRoutes";
import HomePage from "./pages/SharedPortal/pages/HomePage";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };

  const getRole = () => {
    return localStorage.getItem("userRole");
  };

  const RequireAuth = ({ children, role }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    if (role && getRole() !== role) {
      return <Navigate to="/unauthorized" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {AuthRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          path="/parent/*"
          element={
            <RequireAuth role="parent">
              <ParentRoutes />
            </RequireAuth>
          }
        />
        <Route
          path="/child/*"
          element={
            <RequireAuth role="child">
              <ChildRoutes />
            </RequireAuth>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
