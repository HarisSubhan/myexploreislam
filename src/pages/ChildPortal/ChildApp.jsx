import React from "react";
import { Outlet, Link } from "react-router-dom";
import Childheader from "./pages/components/childheader";

const ChildApp = () => {
  return (
    <div>
      <Childheader/>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
