import React from "react";
import HeaderChild from "../ChildPortal/pages/components/HeaderChild";

const ParentApp = () => {
  return (
    <>
      <HeaderChild />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default ParentApp;
