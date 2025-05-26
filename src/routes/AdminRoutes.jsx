import { Routes, Route } from "react-router-dom";
import AdminApp from "../pages/AdminPortal/AdminApp";
import Dashboard from "../pages/AdminPortal/pages/Dashboard"



const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminApp />}>
      <Route index element={<Dashboard />} />
      {/* <Route path="videos" element={<ManageVideos />} /> */}
    </Route>
  </Routes>
);

export default AdminRoutes;
