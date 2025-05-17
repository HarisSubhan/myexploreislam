import React from "react";
import { Outlet, Link } from "react-router-dom";
import ChildHeader from "./pages/components/ChildHeader";
import Banner from "./pages/components/Banner";


const ChildApp = () => {
  return (
    <div>
      <ChildHeader/>
      <Banner/>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
