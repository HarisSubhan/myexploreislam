import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Navbar,
  Image,
  Nav,
  Offcanvas,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "@images/logo.png";
import { CiBellOn, CiMenuBurger } from "react-icons/ci";
import {
  FaBookOpen,
  FaVideo,
  FaGamepad,
  FaHome,
  FaTasks,
} from "react-icons/fa";
import avatar from "@images/DES.png";
import writtenlogo from "@images/WRITTEN.png";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

const HeaderChild = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { color: themeColor, textColor } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // Memoize theme styles to prevent unnecessary re-renders
  const themeStyles = useMemo(
    () => ({
      backgroundColor: themeColor,
      color: textColor,
      borderBottom: "3px solid #FFD700",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1020,
    }),
    [themeColor, textColor]
  );

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulated API call
      setTimeout(() => {
        setNotifications([
          { id: 1, message: "New assignment added", read: false },
          { id: 2, message: "Quiz results available", read: true },
        ]);
      }, 500);
    };
    fetchNotifications();
  }, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Navigation items
  const navItems = useMemo(
    () => [
      { to: "/child", icon: <FaHome size={20} />, text: "Home" },
      { to: "/child/book", icon: <FaBookOpen size={20} />, text: "Books" },
      { to: "/child/video", icon: <FaVideo size={20} />, text: "Videos" },
      { to: "/child/quiz", icon: <FaGamepad size={20} />, text: "Quiz" },
      {
        to: "/child/assignments",
        icon: <FaTasks size={20} />,
        text: "Assignments",
      },
    ],
    []
  );

  const AvatarDropdown = () => (
    <Dropdown.Menu className="dropdown-menu-end">
      <Dropdown.Header className="text-center">
        <Image
          src={user?.avatar || avatar}
          alt="User Avatar"
          roundedCircle
          width={60}
          height={60}
          className="mb-2 border border-2 border-warning"
          loading="lazy"
        />
        <div className="fw-semibold">{user?.name || "Username"}</div>
        <div className="small text-muted">
          {user?.email || "user@example.com"}
        </div>
      </Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item as={Link} to="/child/profile" className="py-2">
        <i className="bi bi-person me-2"></i> Profile
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item as={Link} to="/logout" className="py-2 text-danger">
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  const NotificationDropdown = () => (
    <Dropdown.Menu className="dropdown-menu-end">
      <Dropdown.Header>Notifications</Dropdown.Header>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Dropdown.Item
            key={notification.id}
            className={`py-2 ${!notification.read ? "fw-semibold" : ""}`}
          >
            <div className="d-flex align-items-center">
              <div className="me-2">
                <CiBellOn size={18} />
              </div>
              <div>{notification.message}</div>
            </div>
          </Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item className="py-2 text-muted">
          No notifications
        </Dropdown.Item>
      )}
      <Dropdown.Divider />
      <Dropdown.Item
        as={Link}
        to="/child/notifications"
        className="py-2 text-center text-primary"
      >
        View all
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <>
      <Navbar
        expand="lg"
        className="py-2 py-md-3 child-header"
        style={themeStyles}
      >
        <Container fluid="lg">
          {/* Mobile View */}
          <div className="d-flex d-lg-none w-100 align-items-center justify-content-between">
            <Button
              variant="link"
              onClick={handleShowOffcanvas}
              className="p-0 border-0"
              aria-label="Menu"
              style={{ color: textColor }}
            >
              <CiMenuBurger size={28} />
            </Button>

            <Navbar.Brand as={Link} to="/child" className="mx-auto">
              <Image
                src={logo}
                alt="Fun Learning Logo"
                height={40}
                className="me-2"
                loading="lazy"
              />
            </Navbar.Brand>

            <div className="d-flex align-items-center gap-2">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-notifications-mobile"
                  className="p-0 border-0 position-relative"
                  style={{ color: textColor }}
                >
                  <CiBellOn size={24} />
                  {unreadNotifications > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Dropdown.Toggle>
                <NotificationDropdown />
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-avatar-mobile"
                  className="p-0 border-0"
                >
                  <Image
                    src={user?.avatar || avatar}
                    alt="User Avatar"
                    roundedCircle
                    width={36}
                    height={36}
                    className="border border-2 border-warning"
                    loading="lazy"
                  />
                </Dropdown.Toggle>
                <AvatarDropdown />
              </Dropdown>
            </div>
          </div>

          {/* Desktop View */}
          <div className="d-none d-lg-flex w-100 align-items-center justify-content-between">
            <Navbar.Brand as={Link} to="/child" className="me-4">
              <Image
                src={logo}
                alt="My explore Islam"
                height={60}
                className="me-2"
                loading="lazy"
              />
            </Navbar.Brand>

            <Nav className="mx-auto">
              {navItems.map((item, index) => (
                <Nav.Item key={index} className="mx-2">
                  <Nav.Link
                    as={Link}
                    to={item.to}
                    className="fw-semibold d-flex flex-column align-items-center"
                    activeClassName="active"
                    style={{ color: textColor }}
                  >
                    {React.cloneElement(item.icon, { className: "mb-1" })}
                    <span className="small">{item.text}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <div className="d-flex align-items-center gap-3">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-notifications-desktop"
                  className="p-0 border-0 position-relative"
                  style={{ color: textColor }}
                >
                  <CiBellOn size={24} />
                  {unreadNotifications > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Dropdown.Toggle>
                <NotificationDropdown />
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-avatar-desktop"
                  className="p-0 border-0"
                >
                  <Image
                    src={user?.avatar || avatar}
                    alt="User Avatar"
                    roundedCircle
                    width={40}
                    height={40}
                    className="border border-2 border-warning"
                    loading="lazy"
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
        <Offcanvas.Header
          closeButton
          closeVariant={textColor === "#000000" ? undefined : "white"}
          className="border-bottom"
        >
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <Image
                src={logo}
                alt="Fun Learning Logo"
                height={40}
                className="me-2"
                loading="lazy"
              />
              <Image
                src={writtenlogo}
                alt="Fun Learning"
                height={30}
                loading="lazy"
              />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column px-0">
          <Nav className="flex-column">
            {navItems.map((item, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  as={Link}
                  to={item.to}
                  className="fw-semibold d-flex align-items-center py-3 px-4"
                  onClick={handleCloseOffcanvas}
                  activeClassName="active"
                  style={{ color: textColor }}
                >
                  {React.cloneElement(item.icon, { className: "me-3" })}
                  {item.text}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <div className="mt-auto p-4 border-top">
            <div className="d-flex align-items-center mb-3">
              <Image
                src={user?.avatar || avatar}
                alt="User Avatar"
                roundedCircle
                width={50}
                height={50}
                className="border border-2 border-warning me-3"
                loading="lazy"
              />
              <div style={{ color: textColor }}>
                <div className="fw-semibold">{user?.name || "My Profile"}</div>
                <small className="text-muted">Student</small>
              </div>
            </div>
            <Button
              variant="outline-primary"
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
