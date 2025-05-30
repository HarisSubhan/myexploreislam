import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/AdminPortal/pages/Dashboard";
import ManageParents from "../pages/AdminPortal/pages/ManageParents";
import ManageChildren from "../pages/AdminPortal/pages/ManageChildren";
import ManageVideos from "../pages/AdminPortal/pages/ManageVideos";
import ManageQuizzes from "../pages/AdminPortal/pages/ManageQuizzes";
import ManageAssignments from "../pages/AdminPortal/pages/ManageAssignments";
import ManageBlogs from "../pages/AdminPortal/pages/ManageBlogs";
import Subscriptions from "../pages/AdminPortal/pages/Subscriptions";
import Categories from "../pages/AdminPortal/pages/Categories";
import Settings from "../pages/AdminPortal/pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="parents" element={<ManageParents />} />
      <Route path="children" element={<ManageChildren />} />
      <Route path="videos" element={<ManageVideos />} />
      <Route path="quizzes" element={<ManageQuizzes />} />
      <Route path="assignments" element={<ManageAssignments />} />
      <Route path="blogs" element={<ManageBlogs />} />
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="categories" element={<Categories />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
