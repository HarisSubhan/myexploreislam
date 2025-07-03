import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import { ThemeProvider } from "../../context/ThemeContext"; 

const ChildApp = () => {
  return (
    <ThemeProvider>
      <div>
        <HeaderChild />
        <main >
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ChildApp;
