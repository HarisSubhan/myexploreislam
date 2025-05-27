import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../../../src/components/admin/Header';
import Sidebar from "../../../src/components/admin/Sidebar";

const AdminApp = () => {
  return (
    <div className="d-flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div style={{ marginLeft: "250px", width: "100%" }}>
        <Header />
        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
