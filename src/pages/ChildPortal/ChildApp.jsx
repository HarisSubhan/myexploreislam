import React from "react";
import { Outlet, Link } from "react-router-dom";
import ChildHeader from "./pages/components/ChildHeader";

const ChildApp = () => {
  return (
    <div>
      <ChildHeader />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
