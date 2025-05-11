// src/pages/ChildPortal/ChildApp.jsx
import { Outlet } from "react-router-dom";

const ChildApp = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ChildApp;
