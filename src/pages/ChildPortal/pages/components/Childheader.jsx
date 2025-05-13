import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Navbar,
  FormControl,
  Dropdown,
  Image,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import logo from "@images/logo.png";
import { CiBellOn, CiMenuBurger } from "react-icons/ci";
import avatar from "@images/DES.png";
import writtenlogo from "@images/WRITTEN.png";

const Childheader = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const logoHeightMobile = 40; // Increased logo height for mobile
  const logoHeightDesktop = 50; // Increased logo height for desktop
  const writtenLogoHeightMobile = 40; // Increased written logo height for mobile

  return (
    <>
      <Navbar bg="light" expand="lg" className="py-2 py-md-3 navbar-light" data-bs-theme="light">
        <Container className="px-3 px-md-4">
          <div className="d-flex w-100 align-items-center justify-content-between">
            {/* Mobile Layout (small screens) */}
            <div className="d-flex d-lg-none w-100 align-items-center">
              {/* Left: Menu Toggle */}
              <CiMenuBurger size={24} className="cursor-pointer me-3" onClick={handleShowOffcanvas} />

              {/* Middle: Logo */}
              <Navbar.Brand as={Link} to="/child" className="mx-auto">
                <div className="d-flex align-items-center">
                  <Image src={logo} alt="Company Logo" height={logoHeightMobile} className="me-2" />
                  <Image src={writtenlogo} alt="Company Name" height={writtenLogoHeightMobile} />
                </div>
              </Navbar.Brand>

              {/* Right: User Dropdown */}
              <Dropdown className="ms-auto">
                <Dropdown.Toggle
                  variant="link"
                  id="mobile-dropdown-basic"
                  className="p-0 border-0 bg-transparent shadow-none"
                >
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    roundedCircle
                    width={32}
                    height={32}
                    className="border border-2 border-primary"
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
                      className="mb-2 border border-2 border-primary"
                    />
                    <div>Username</div>
                    <div className="small text-muted">user@example.com</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i> Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/logout">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Desktop Layout (large screens) */}
            <div className="d-none d-lg-flex w-100 align-items-center justify-content-between">
              {/* Desktop Logo */}
              <Navbar.Brand as={Link} to="/child">
                <Image src={logo} alt="Company Logo" height={logoHeightDesktop} />
              </Navbar.Brand>

              {/* Center Menu */}
              <Nav className="mx-auto">
                <Nav.Item className="mx-3">
                  <Link to="/child" className="nav-link fw-bold">
                    Home
                  </Link>
                </Nav.Item>
                <Nav.Item className="mx-3">
                  <Link to="/child/book" className="nav-link fw-bold">
                    Book
                  </Link>
                </Nav.Item>
                <Nav.Item className="mx-3">
                  <Link to="/child/video" className="nav-link fw-bold">
                    Video
                  </Link>
                </Nav.Item>
              </Nav>

              {/* Desktop Right Icons */}
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
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    id="desktop-dropdown-basic"
                    className="p-0 border-0 bg-transparent shadow-none"
                  >
                    <Image
                      src={avatar}
                      alt="User Avatar"
                      roundedCircle
                      width={40}
                      height={40}
                      className="border border-2 border-primary"
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
                        className="mb-2 border border-2 border-primary"
                      />
                      <div>Username</div>
                      <div className="small text-muted">user@example.com</div>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="bi bi-person me-2"></i> Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      <i className="bi bi-gear me-2"></i> Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/logout">
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start" bg="light" text="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <Image src={logo} alt="Company Logo" height={logoHeightMobile} className="me-2" />
              <Image src={writtenlogo} alt="Company Name" height={writtenLogoHeightMobile} />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between h-100">
          <Nav className="flex-column">
            <Nav.Item className="mb-2">
              <Link to="/child" className="nav-link fw-bold text-dark" onClick={handleCloseOffcanvas}>
                Home
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Link to="/child/book" className="nav-link fw-bold text-dark" onClick={handleCloseOffcanvas}>
                Book
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Link to="/child/video" className="nav-link fw-bold text-dark" onClick={handleCloseOffcanvas}>
                Video
              </Link>
            </Nav.Item>
          </Nav>
          <div>
            <hr className="border-dark-subtle" />
            <div className="d-flex flex-column align-items-start">
              <Link to="/profile" className="nav-link small text-dark mb-2" onClick={handleCloseOffcanvas}>
                <i className="bi bi-person me-2"></i> Profile
              </Link>
              <Link to="/settings" className="nav-link small text-dark mb-2" onClick={handleCloseOffcanvas}>
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
              <Link to="/logout" className="nav-link small text-dark mb-2" onClick={handleCloseOffcanvas}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Link>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Childheader;