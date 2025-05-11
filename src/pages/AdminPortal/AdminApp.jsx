// src/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminPortal/Dashboard";
import AdminSettings from "../pages/AdminPortal/Settings";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="settings" element={<AdminSettings />} />
    {/* Other admin routes... */}
  </Routes>
);

export default AdminRoutes;
