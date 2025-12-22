import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "@images/logo.png";
import backgroundImage from "@images/footer1.jpg";
import { FaInstagram, FaFacebook } from "react-icons/fa";

const MainFooter = () => {
  return (
    <footer
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        fontFamily: "'Poppins', sans-serif",
        padding: "1.5rem 0", // Reduced padding
        borderTop: "1px solid #dee2e6",
      }}
    >
      <Container>
        <Row className="text-center text-md-start">
          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={logo}
                alt="Kids Learn Logo"
                style={{ 
                  maxWidth: "200px", // Slightly smaller logo
                  height: "auto",
                  alignSelf: "center" // Aligns with content
                }}
              />
            </div>
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3" style={{ color: "#F1066C", fontSize: "1.1rem" }}>
              Navigation
            </h5>
            <ul className="list-unstyled">
              {[
                { name: "Home", url: "/" },
                { name: "Subscription", url: "/Subscription" },
                { name: "Blog", url: "/blog" },
                { name: "FAQs", url: "/faqs" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="text-dark text-decoration-none d-block py-1"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3" style={{ color: "#F1066C", fontSize: "1.1rem" }}>
              Helpful Links
            </h5>
            <ul className="list-unstyled">
              {[
                { name: "About Islam", url: "/about-islam" },
                { name: "Contact", url: "/Contact" },
                { name: "Login", url: "/login" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="text-dark text-decoration-none d-block py-1"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold mb-3" style={{ color: "#F1066C", fontSize: "1.1rem" }}>
              Contact Us
            </h5>
            <div className="mb-3">
              <p className="mb-2" style={{ fontSize: "0.95rem" }}>
               myexploreislam@gmail.com
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div>
              <h6 className="fw-bold mb-2" style={{ color: "#F1066C", fontSize: "1rem" }}>
                Follow Us
              </h6>
              <div className="d-flex justify-content-start gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#E1306C" }}
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#1877F2" }}
                >
                  <FaFacebook size={24} />
                </a>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-3" style={{ margin: "1rem 0" }} /> {/* Reduced margin */}

        <Row>
          <Col className="text-center">
            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
              © {new Date().getFullYear()} Kids Learn. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter;