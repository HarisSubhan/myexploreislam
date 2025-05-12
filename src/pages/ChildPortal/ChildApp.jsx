// src/pages/ChildPortal/ChildApp.jsx
import { Outlet } from "react-router-dom";
import ChildDashboard from "./pages/ChildDashboard";
import Book from "./pages/Book";
import ChildVideos from "./pages/ChildVideos";

const ChildApp = () => {
  return (
    <div>
      <ChildDashboard/>
      <Book/>
      <ChildVideos/>
      {/* <Outlet /> */}
    </div>
  );
};

export default ChildApp;
