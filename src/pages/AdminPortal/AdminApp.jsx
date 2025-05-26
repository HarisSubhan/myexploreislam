import React from "react";
import { Outlet } from "react-router-dom";
import ParentHeader from "../../components/admin/Header";



const AdminApp = () => {
  return (
    <>
      <ParentHeader />
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminApp;
