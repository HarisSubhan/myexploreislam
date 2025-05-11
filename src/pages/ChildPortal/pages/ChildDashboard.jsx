import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Navbar,
  FormControl,
  Dropdown,
  Image,
} from "react-bootstrap";
import logo from "@images/logo.png";
import { CiBellOn, CiDark, CiLight } from "react-icons/ci";
import avatar from "@images/c.png";

const ChildDashboard = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference or use system preference
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode !== null) return savedMode === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  // Apply dark/light mode to the entire document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      expand="lg"
      className={`py-2 py-md-3 ${darkMode ? "navbar-dark" : "navbar-light"}`}
      data-bs-theme={darkMode ? "dark" : "light"}
    >
      <Container fluid>
        {/* Mobile layout (collapsed) */}
        <div className="d-flex d-lg-none w-100 align-items-center justify-content-between">
          <Navbar.Brand href="#home" className="me-0">
            <img src={logo} alt="Company Logo" height="30" />
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-2">
            <CiBellOn size={20} className="cursor-pointer" />
            <div
              onClick={toggleDarkMode}
              className="cursor-pointer"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <CiLight size={20} /> : <CiDark size={20} />}
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="p-0 border-0 bg-transparent shadow-none"
              >
                <Image
                  src={avatar}
                  alt="User Avatar"
                  roundedCircle
                  width={32}
                  height={32}
                  className={`border border-2 ${
                    darkMode ? "border-light" : "border-primary"
                  }`}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header className="text-center">
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    roundedCircle
                    width={60}
                    height={60}
                    className={`mb-2 border border-2 ${
                      darkMode ? "border-light" : "border-primary"
                    }`}
                  />
                  <div>Username</div>
                  <div className="small text-muted">user@example.com</div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item href="#/action-1">
                  <i className="bi bi-person me-2"></i> Profile
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  <i className="bi bi-gear me-2"></i> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#/action-3">
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Desktop layout (expanded) */}
        <Row className="d-none d-lg-flex w-100 align-items-center">
          <Col lg={4}>
            <Navbar.Brand href="#home">
              <img src={logo} alt="Company Logo" height="30" />
            </Navbar.Brand>
          </Col>
          <Col lg={8} className="d-flex justify-content-end">
            <div className="d-flex align-items-center gap-3">
              <Form className="d-flex me-2">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  style={{ minWidth: "200px" }}
                />
              </Form>
              <CiBellOn size={24} className="cursor-pointer" />
              <div
                onClick={toggleDarkMode}
                className="cursor-pointer"
                title={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <CiLight size={24} /> : <CiDark size={24} />}
              </div>

              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  className="p-0 border-0 bg-transparent shadow-none"
                >
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    roundedCircle
                    width={40}
                    height={40}
                    className={`border border-2 ${
                      darkMode ? "border-light" : "border-primary"
                    }`}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Header className="text-center">
                    <Image
                      src={avatar}
                      alt="User Avatar"
                      roundedCircle
                      width={60}
                      height={60}
                      className={`mb-2 border border-2 ${
                        darkMode ? "border-light" : "border-primary"
                      }`}
                    />
                    <div>Username</div>
                    <div className="small text-muted">user@example.com</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/action-1">
                    <i className="bi bi-person me-2"></i> Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/action-3">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default ChildDashboard;
