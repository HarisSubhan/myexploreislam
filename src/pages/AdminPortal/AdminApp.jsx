// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from '../../../src/components/admin/Header';
// import Sidebar from "../../../src/components/admin/Sidebar";
// import StatCard from "../../../src/components/admin/StatCard";

// const AdminApp = ({ children }) => {
//   return (
//     <div className="d-flex">
//       {/* Left Sidebar */}
//       <Sidebar />

//       {/* Main Area */}
//       <div style={{ width: "100%" }}>
//         <Header />
//         <main style={{ padding: "1rem" }}>
//           <Outlet />
//           <StatCard/>

//           {/* {children} */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminApp;


import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="p-3">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
