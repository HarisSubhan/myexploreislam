import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminApp from "../pages/AdminPortal/AdminApp";
import Dashboard from "../pages/AdminPortal/pages/Dashboard";
import ManageParents from "../pages/AdminPortal/pages/ManageParents";
// Import other admin pages as needed
// import ManageVideos from "../pages/AdminPortal/pages/ManageVideos";
// import ManageCategories from "../pages/AdminPortal/pages/ManageCategories";
// import ManageCourses from "../pages/AdminPortal/pages/ManageCourses";
// import ManageUsers from "../pages/AdminPortal/pages/ManageUsers";
// import BlogManagement from "../pages/AdminPortal/pages/BlogManagement";
// import Settings from "../pages/AdminPortal/pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminApp />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="parents" element={<ManageParents />} />
        {/* Add additional routes here */}
        {/* <Route path="videos" element={<ManageVideos />} /> */}
        {/* <Route path="categories" element={<ManageCategories />} /> */}
        {/* <Route path="courses" element={<ManageCourses />} /> */}
        {/* <Route path="users" element={<ManageUsers />} /> */}
        {/* <Route path="blogs" element={<BlogManagement />} /> */}
        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
