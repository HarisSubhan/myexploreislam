import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ModuleBrowser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filter = location.state?.filter; // 'series' or 'single'

  // You can implement filtering logic here
  return (
    <div>
      <h2>Browse All Modules</h2>
      {/* Add module browsing interface */}
    </div>
  );
};

export default ModuleBrowser;
