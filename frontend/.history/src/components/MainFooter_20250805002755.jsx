import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "@images/logo.png"; // Make sure path is correct

const MainFooter = () => {
  
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem 0",
      }}
    >
      <Container>
        <Row className="text-center text-md-start align-items-start">
          
          <Col xs={12} md={4} className="mb-4 mb-md-0">
          <h5 className="fw-bold" style={{ color: "#F1066C" }}>
              About Us
            </h5>
            <img
              src={logo}
              alt="Kids Learn Logo"
            
              style={{ maxWidth: "150px", marginBottom: "1rem" }}
            />
           
          </Col>

          
          <Col xs={12} md={4} className="mb-4 mb-md-0">
  <h5 className="fw-bold" style={{ color: "#F1066C" }}>
    Quick Links
  </h5>
  <ul className="list-unstyled">
    {["Home", "About", "Blog"].map((link, idx) => {
      const url = link === "About" ? "#about-islam" : `/${link.toLowerCase()}`;
      return (
        <li key={idx}>
          <a
            href={url}
            className="text-dark text-decoration-none d-block py-1"
          >
            {link}
          </a>
        </li>
      );
    })}
  </ul>
</Col>



        
          <Col xs={12} md={4}>
            <h5 className="fw-bold" style={{ color: "#F1066C" }}>
              Contact Us
            </h5>
            <p className="mb-1">📧 support@kidslearn.com</p>
            <p className="mb-1">📞 +1 (234) 567-890</p>
            <p>📍 123 Learning St, Education City</p>
          </Col>
        </Row>

        <hr className="my-4" />

       
        <Row>
          <Col className="text-center">
            <small className="text-muted">
              © {new Date().getFullYear()} Kids Learn. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter;
