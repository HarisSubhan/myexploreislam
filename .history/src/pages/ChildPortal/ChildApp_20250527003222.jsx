import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import ThemeSelector from "../../context/ThemeContext"

import { useThemeColor } from "../../context/ThemeContext";


const ChildApp = () => {
  return (
    <div>
      <HeaderChild />
      <div className="px-4 pt-3">
import { useThemeColor } from "../../context/ThemeContext";
<ThemeSelector />
      </div>

      <Banner />

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildApp;
