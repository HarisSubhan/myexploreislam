import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "@images/logo.png"; // Adjust path if needed

const MainFooter = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem 0",
        borderTop: "1px solid #dee2e6",
      }}
    >
      <Container>
        <Row className="text-center text-md-start">
          
          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <img
              className="mx-auto"
              src={logo}
              alt="Kids Learn Logo"
              style={{ maxWidth: "100px", marginBottom: "1rem" }}
            />
            <p className="text-muted small">
              Kids Learn is your trusted platform for gentle, joyful, and
              authentic Islamic learning.
            </p>
          </Col>

          
          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <h5 className="fw-bold" style={{ color: "#F1066C" }}>
              Navigation
            </h5>
            <ul className="list-unstyled">
              {[
                { name: "Home", url: "/" },
                {
                  name: "Subscription",
                  url: "http://localhost:5173/Subscription",
                },
                { name: "Blog", url: "http://localhost:5173/blog" },
                { name: "FAQs", url: "http://localhost:5173/faqs" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="text-dark text-decoration-none d-block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

         
          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <h5 className="fw-bold" style={{ color: "#F1066C" }}>
              Helpful Links
            </h5>
            <ul className="list-unstyled">
              {[
                {
                  name: "About Islam",
                  url: "http://localhost:5173/about-islam",
                },
                { name: "Contact", url: "http://localhost:5173/Contact" },
                { name: "Login", url: "http://localhost:5173/login" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="text-dark text-decoration-none d-block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          
          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold" style={{ color: "#F1066C" }}>
              Contact Us
            </h5>
            <p className="mb-1">📧 support@kidslearn.com</p>
            <p className="mb-1">📞 +1 (234) 567-890</p>
            <p className="mb-0">📍 123 Learning St, Education City</p>
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
