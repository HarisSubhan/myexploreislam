import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header";
import MainFooter from "../../components/MainFooter";
const StaticApp = () => {
  return (
    
    <div>
        <Header />
      <Outlet />
      <MainFooter/>
    </div>
  );
};

export default StaticApp;
