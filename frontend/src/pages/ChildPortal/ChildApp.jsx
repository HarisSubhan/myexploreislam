import React, { useState } from "react";
import { Container, Row, Col, Navbar, Button, Image } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaBook,
  FaQuestionCircle,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import logo from "@images/logo.png";
import { authAPI } from "../../services/api";
import { MdForwardToInbox } from "react-icons/md";



const ChildApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      icon: <FaUser size={50} />,
      label: "Account",
      path: "/child/profile",
      color: "#FFD166",
    },
    {
      icon: <FaBook size={50} />,
      label: "Modules",
      path: "/child",
      color: "#F1066c",
    },
    
    {
      icon: <MdForwardToInbox size={50} />,
      label: "Inbox",
      path: "/child/inbox",
      color: "#3A86FF",
    },
    {
      icon: <FaQuestionCircle size={50} />,
      label: "Help",
      path: "/child/help-Support",
      color: "#FB5607",
    },
    {
      icon: <IoIosLogOut size={50} />,
      label: "Logout",
      path: "/login",
      color: "#FB5607",
      isLogout: true,
    },
  ];

  const handleLogout = async () => {
    try {
      
      await authAPI.logout();

    
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

     
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleNavigation = (path, isLogout = false) => {
    if (isLogout) {
      handleLogout();
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        bg="light"
        className="px-3 d-flex align-items-center shadow-sm"
        sticky="top"
      >
        <Image
          src={logo}
          alt="Fun Learning Logo"
          height={40}
          className="me-2"
          loading="lazy"
        />
        <Button
          variant="outline-secondary"
          onClick={toggleSidebar}
          className="me-2"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </Button>
        <Navbar.Brand className="fw-bold">Explore Islam</Navbar.Brand>
      </Navbar>

      <Container fluid className="p-0">
        <Row className="g-0">
          {sidebarOpen && (
            <Col
              xs={1}
              md={1}
              className="bg-white border-end pt-4"
              style={{ minHeight: "calc(100vh - 56px)" }}
            >
              <div className="d-flex flex-column align-items-center gap-4 px-2">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigation(item.path, item.isLogout)}
                    className="text-center p-3 rounded-3 w-100"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${item.color}20`; // 20% opacity
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        marginTop: "8px",
                        color: "#333",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          )}

          <Col
            className="bg-light p-4"
            style={{ minHeight: "calc(100vh - 56px)" }}
          >
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChildApp;
