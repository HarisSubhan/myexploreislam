import { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Offcanvas,
  NavDropdown,
  Accordion,
} from "react-bootstrap";
import logo from "@images/Black_logo.png";
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);

  

  return (
    <>
      <Navbar style={{ backgroundColor: "#00D7A9" }} expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              alt="Explore Islam"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Button
            variant="outline-light"
            className="d-lg-none"
            onClick={handleShow}
            aria-label="Open menu"
          >
            ☰
          </Button>

          
<Nav className="mx-auto d-none d-lg-flex gap-4 align-items-center">
  <Nav.Link href="/">Home</Nav.Link>

  {/* About Us as clickable link AND dropdown */}
 <NavDropdown
  title={
    <LinkContainer to="/about-us" style={{ cursor: 'pointer' }}>
      <span>About Us</span>
    </LinkContainer>
  }
  id="about-us-dropdown"
>
  <LinkContainer to="/how-it-works">
    <NavDropdown.Item>How It Works</NavDropdown.Item>
  </LinkContainer>
  <LinkContainer to="/faqs">
    <NavDropdown.Item>FAQs</NavDropdown.Item>
  </LinkContainer>
</NavDropdown>

  <Nav.Link href="/about-islam">About Islam</Nav.Link>
  <Nav.Link href="/Contact">Contact Us</Nav.Link>
</Nav>

          <div className="d-none d-lg-block">
            <Button variant="warning" href="/login">
              Log In
            </Button>
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showMenu}
        onHide={handleClose}
        placement="start"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Navbar.Brand href="/" className="m-0">
            <img src={logo} alt="Explore Islam" height="40" />
          </Navbar.Brand>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/" onClick={handleClose}>Home</Nav.Link>

            <Accordion flush>
              <Accordion.Item eventKey="how">
                <Accordion.Header>How It Works</Accordion.Header>
                <Accordion.Body>
                  <Button 
                    variant="link"
                    className="d-block text-start mb-2"
                    href="/Subscription"
                    onClick={handleClose}
                  >
                    Subscription
                  </Button>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="about">
                <Accordion.Header>About Us</Accordion.Header>
                <Accordion.Body>
                  <Button
                    variant="link"
                    className="d-block text-start mb-2"
                    href="/blog"
                    onClick={handleClose}
                  >
                    Blog
                  </Button>
                  <Button
                    variant="link"
                    className="d-block text-start"
                    href="/faqs"
                    onClick={handleClose}
                  >
                    FAQs
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Nav.Link href="/about-islam" onClick={handleClose}>About Islam</Nav.Link>
            <Nav.Link href="/Contact" onClick={handleClose}>Contact Us</Nav.Link>

            <Button variant="warning" className="mt-3" href="/login" onClick={handleClose}>
              Log In
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
