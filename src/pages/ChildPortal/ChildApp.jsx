import React from "react";
import { Outlet, Link } from "react-router-dom";
import Banner from "./pages/components/Banner";
import HeaderChild from "./pages/components/HeaderChild";

const ChildApp = () => {
  return (
    <div>
      <HeaderChild />
      <Banner />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
