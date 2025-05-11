// src/routes/ChildRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ChildApp from "../pages/ChildPortal/ChildApp";
import ChildDashboard from "../pages/ChildPortal/pages/ChildDashboard";

const ChildRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChildApp />}>
        <Route index element={<ChildDashboard />} />
      </Route>
    </Routes>
  );
};

export default ChildRoutes;
