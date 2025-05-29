import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import { ThemeProvider } from "../../context/ThemeContext"; // Import ThemeProvider

const ChildApp = () => {
  return (
    <ThemeProvider>
      <div
        style={{
          backgroundColor: "var(--primary-color)",
          minHeight: "100vh",
          color: "var(--text-on-primary)",
        }}
      >
        <HeaderChild />
        <Banner />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ChildApp;
