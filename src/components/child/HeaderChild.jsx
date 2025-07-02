import React, { useState } from "react";
import {
  Container,
  Navbar,
  Image,
  Nav,
  Offcanvas,
  Button,
  Dropdown
} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "@images/logo.png";
import { CiBellOn, CiMenuBurger } from "react-icons/ci";
import { FaBookOpen, FaVideo, FaGamepad, FaHome, FaTasks } from "react-icons/fa";
import avatar from "@images/DES.png";
import writtenlogo from "@images/WRITTEN.png";
import { useTheme } from "../../context/ThemeContext";


const HeaderChild = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { color: themeColor, textColor } = useTheme();
  
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const themeStyles = {
    backgroundColor: themeColor,
    color: textColor,
  };

  // Avatar dropdown menu items
  const AvatarDropdown = () => (
    <Dropdown.Menu >
      <Dropdown.Header className="text-center" >
        <Image
          src={avatar}
          alt="User Avatar"
          roundedCircle
          width={60}
          height={60}
          className="mb-2 border border-2 border-warning"
        />
        <div>Username</div>
        <div className="small text-muted">user@example.com</div>
      </Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item as={Link} to="/profile" >
        <i className="bi bi-person me-2"></i> Profile
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/settings" >
        <i className="bi bi-gear me-2"></i> Settings
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item as={Link} to="/logout" >
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <>
      <Navbar
        style={{ 
          ...themeStyles,
          borderBottom: "3px solid #FFD700",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
        expand="lg"
        className="py-2 py-md-3 child-header"
      >
        <Container style={themeStyles}>
          {/* Mobile View */}
          <div className="d-flex d-lg-none w-100 align-items-center">
            <Button 
              variant="link"
              onClick={handleShowOffcanvas}
              className="p-0 border-0"
              aria-label="Menu"
              style={{ color: textColor }}
            >
              <CiMenuBurger size={28} className="menu-icon" />
            </Button>

            <Navbar.Brand as={Link} to="/child" className="mx-auto" style={themeStyles}>
              <div className="d-flex align-items-center">
                <Image
                  src={logo}
                  alt="Fun Learning Logo"
                  height={40}
                  className="me-2 bounce"
                />
              </div>
            </Navbar.Brand>

            <div className="d-flex align-items-center">
              <CiBellOn size={24} className="me-3 notification-icon" style={{ color: textColor }} />
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-avatar-mobile"
                  className="p-0 border-0 bg-transparent shadow-none"
                >
                  <Image
                    src={avatar}
                    alt="My Avatar"
                    roundedCircle
                    width={36}
                    height={36}
                    className="border border-3 border-warning avatar"
                  />
                </Dropdown.Toggle>
                <AvatarDropdown />
              </Dropdown>
            </div>
          </div>

          {/* Desktop View */}
          <div className="d-none d-lg-flex w-100 align-items-center justify-content-between">
            <Navbar.Brand as={Link} to="/child" className="d-flex align-items-center" style={themeStyles}>
              <Image
                src={logo}
                alt="My explore Islam"
                height={80}
                className="me-2 bounce"
              />
            </Navbar.Brand>

            <Nav className="mx-auto nav-links" style={themeStyles}>
              {[
                { to: "/child", icon: <FaHome size={20} />, text: "Home" },
                { to: "/child/book", icon: <FaBookOpen size={20} />, text: "Books" },
                { to: "/child/video", icon: <FaVideo size={20} />, text: "Videos" },
                { to: "/child/quiz", icon: <FaGamepad size={20} />, text: "Quiz" },
                { to: "/child/assignments", icon: <FaTasks size={20} />, text: "Assignment" },
              ].map((item, index) => (
                <Nav.Item key={index} className="mx-2">
                  <Link 
                    to={item.to} 
                    className="nav-link fw-bold d-flex flex-column align-items-center"
                    style={{ color: textColor }}
                  >
                    {React.cloneElement(item.icon, { className: "mb-1" })}
                    <span>{item.text}</span>
                  </Link>
                </Nav.Item>
              ))}
            </Nav>

            <div className="d-flex align-items-center">
              <CiBellOn 
                size={26} 
                className="me-3 notification-icon" 
                style={{ color: textColor }} 
              />
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-avatar-desktop"
                  className="p-0 border-0 bg-transparent shadow-none"
                >
                  <Image
                    src={avatar}
                    alt="My Avatar"
                    roundedCircle
                    width={42}
                    height={42}
                    className="border border-3 border-warning avatar"
                  />
                </Dropdown.Toggle>
                <AvatarDropdown />
              </Dropdown>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="start"
        style={themeStyles}
        className="child-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant={textColor === '#000000' ? undefined : 'white'}>
          <Offcanvas.Title className="w-100">
            <div className="d-flex align-items-center justify-content-center w-100">
              <Image
                src={logo}
                alt="Fun Learning Logo"
                height={40}
                className="me-2"
              />
              <Image
                src={writtenlogo}
                alt="Fun Learning"
                height={40}
              />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          <Nav className="flex-column">
            {[
              { to: "/child", icon: <FaHome size={20} />, text: "Home" },
              { to: "/child/book", icon: <FaBookOpen size={20} />, text: "Books" },
              { to: "/child/video", icon: <FaVideo size={20} />, text: "Videos" },
              { to: "/child/quiz", icon: <FaGamepad size={20} />, text: "Games" },
              { to: "/child/assignments", icon: <FaTasks size={20} />, text: "Tasks" },
            ].map((item, index) => (
              <Nav.Item key={index} className="mb-3">
                <Link
                  to={item.to}
                  className="nav-link fw-bold d-flex align-items-center"
                  onClick={handleCloseOffcanvas}
                  style={{ color: textColor }}
                >
                  {React.cloneElement(item.icon, { className: "me-3" })}
                  {item.text}
                </Link>
              </Nav.Item>
            ))}
          </Nav>
          
          <div className="mt-auto user-section">
            <div className="d-flex align-items-center mb-3">
              <Image
                src={avatar}
                alt="My Avatar"
                roundedCircle
                width={50}
                height={50}
                className="border border-3 border-warning me-3"
              />
              <div style={{ color: textColor }}>
                <div className="fw-bold">My Profile</div>
                <small>Student</small>
              </div>
            </div>
            <Button 
              variant={textColor === '#000000' ? "outline-dark" : "outline-light"}
              className="w-100"
              as={Link}
              to="/logout"
            >
              Sign Out
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default HeaderChild;