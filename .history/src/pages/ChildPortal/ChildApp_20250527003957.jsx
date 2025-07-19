import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import { useThemeColor } from "../../context/ThemeContext";

const ChildApp = () => {
  const { themeColor } = useThemeColor();

  return (
    <div style={{ borderTop: `5px solid ${themeColor}` }}>
      <HeaderChild />
      <Banner />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
