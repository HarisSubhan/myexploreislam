import React from "react";
import { Outlet, Link } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";

const ChildApp = () => {
  const { themeColor } = useThemeColor();
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
