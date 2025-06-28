import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header";
import MainFooter from "../../components/MainFooter";
import { ThemeProvider } from "../../context/ThemeContext";
const StaticApp = () => {
  return (
      <ThemeProvider>
          <div>
            <Header />
            <main >
              <Outlet />
            </main>
            <MainFooter/>
          </div>
        </ThemeProvider>
    
   
  );
};

export default StaticApp;
