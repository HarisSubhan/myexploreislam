import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import StatCard from "../../components/admin/StatCard";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      {/* Left Sidebar - keep if needed for navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <Header />
        <main className="p-3">
          <Outlet /> {/* For nested routes */}
          <StatCard /> {/* Keep if still needed */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;