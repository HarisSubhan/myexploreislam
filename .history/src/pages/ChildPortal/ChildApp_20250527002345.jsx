import React from "react";
import { Outlet, Link } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import { useThemeColor } from "../../context/ThemeContext";
import ThemeSelector from "../../components/";

const ChildApp = () => {
  const { themeColor } = useThemeColor();
  return (
    <div style={{ backgroundColor: themeColor, minHeight: "100vh" }}>
      <ThemeSelector />
      <HeaderChild />
      <Banner />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
