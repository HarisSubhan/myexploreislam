import React from "react";
import { Outlet, Link } from "react-router-dom";
import Banner from "../../components/child/Banner";
import HeaderChild from "../../components/child/HeaderChild";
import { useThemeColor } from "../../context/ThemeContext";

const ChildApp = () => {
    const { themeColor } = useThemeColor();


    
      const theme = useMemo(
        () =>
          createTheme({
            palette: {
              mode: darkMode ? "dark" : "light",
              primary: {
                main: themeColor,
              },
            },
            breakpoints: {
              values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
              },
            },
          }),
        [darkMode, themeColor]
      );
  
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
