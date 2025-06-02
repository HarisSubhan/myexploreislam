import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/AdminPortal/pages/Dashboard";
import ManageParents from "../pages/AdminPortal/pages/ManageParents";
import ManageChildren from "../pages/AdminPortal/pages/ManageChildren";

import ManageVideos from "../pages/AdminPortal/pages/ManageVideos";
import AddVideo from "../pages/AdminPortal/pages/ManageVideos/AddVideo";
import EditVideo from "../pages/AdminPortal/pages/ManageVideos/EditVideo";
import ViewVideo from "../pages/AdminPortal/pages/ManageVideos/ViewVideo";

import ManageQuizzes from "../pages/AdminPortal/pages/ManageQuizzes";
import AddQuiz from "../pages/AdminPortal/pages/ManageQuizzes/AddQuiz";
import EditQuiz from "../pages/AdminPortal/pages/ManageQuizzes/EditQuiz";
import ViewQuiz from "../pages/AdminPortal/pages/ManageQuizzes/ViewQuiz";

import ManageAssignments from "../pages/AdminPortal/pages/ManageAssignments";
import AddAssignment from "../pages/AdminPortal/pages/ManageAssignments/AddAssignment";
import EditAssignment from "../pages/AdminPortal/pages/ManageAssignments/EditAssignment";
import ViewAssignment from "../pages/AdminPortal/pages/ManageAssignments/ViewAssignment";

import ManageBooks from "../pages/AdminPortal/pages/ManageBooks";
import AddBook from "../pages/AdminPortal/pages/ManageBooks/AddBook";
import EditBook from "../pages/AdminPortal/pages/ManageBooks/EditBook";
import ViewBook from "../pages/AdminPortal/pages/ManageBooks/ViewBook";


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
      <Route path="manage-videos/view/:id" element={<ViewVideo />} />
      <Route path="manage-videos/add" element={<AddVideo />} />
      <Route path="manage-videos/edit/:id" element={<EditVideo />} />

      <Route path="quizzes" element={<ManageQuizzes />} />
      <Route path="manage-quizzes/view/:id" element={<ViewQuiz />} />
      <Route path="manage-quizzes/add" element={<AddQuiz />} />
      <Route path="manage-quizzes/edit/:id" element={<EditQuiz />} />

      <Route path="assignments" element={<ManageAssignments />} />
      <Route path="/manage-assignments/add" element={<AddAssignment />} />
      <Route path="/manage-assignments/edit/:id" element={<EditAssignment />} />
      <Route path="/manage-assignments/view/:id" element={<ViewAssignment />} />

      <Route path="manage-books" element={<ManageBooks />} />
      <Route path="/manage-books/add" element={<AddBook />} />
      <Route path="/manage-books/edit/:id" element={<EditBook />} />
      <Route path="/manage-books/view/:id" element={<ViewBook />} />

      <Route path="blogs" element={<ManageBlogs />} />

      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="categories" element={<Categories />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
