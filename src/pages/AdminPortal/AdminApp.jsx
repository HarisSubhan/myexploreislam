import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./pages/components/Header";


const AdminApp = () => {
  return (
    <>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminApp;
