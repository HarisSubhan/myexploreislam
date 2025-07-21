import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width: '250px' }}>
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        
        {/* Top Bar: Toggle + Header */}
        <div className="d-flex align-items-center justify-content-between p-2 bg-white shadow-sm">
          <Button variant="outline-secondary" onClick={toggleSidebar} className="me-2">
            <FaBars />
          </Button>
          <div className="flex-grow-1">
            <Header />
          </div>
        </div>

        {/* Main Body Content */}
        <main className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
