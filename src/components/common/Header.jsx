import { useState } from "react";
import { Container, Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import logo from "@images/logo.png";

const Header = () => {

  
  const [showMenu, setShowMenu] = useState(false);
  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    handleClose(); // close menu if open
  };

  return (
    <>
      <Navbar style={{ backgroundColor: "#00D7A9" }}>
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              alt="Explore Islam"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Button
            variant="outline-light"
            className="d-lg-none"
            onClick={handleShow}
          >
            ☰
          </Button>

         
          <Nav className="mx-auto d-none d-lg-flex gap-4">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#about-islam">About Islam</Nav.Link>
            <Nav.Link href="#how-it-works">How It Works</Nav.Link>
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
        backdrop={true} 
        scroll={false}
      >
        <Offcanvas.Header closeButton>
          <Navbar.Brand href="/" className="m-0">
            <img
              src={logo}
              alt="Explore Islam"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/" onClick={handleClose}>
              Home
            </Nav.Link>
            <Nav.Link
  href="#about-islam"
  onClick={(e) => {
    e.preventDefault();
    scrollToSection("about-islam");
  }}
>
  About Islam
</Nav.Link>
            <Nav.Link href="#how-it-works" onClick={(e) => {
    e.preventDefault();
    scrollToSection("about-islam");
  }}>
              How It Works
            </Nav.Link>
            <Button
              variant="warning"
              className="mt-3"
              href="/login"
              onClick={handleClose}
            >
              Log In
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
