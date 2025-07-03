import React from "react";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import MaryamMuazImage from "@images/Maryam___Muaz.png";
import DecorativeImage from "@images/c.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClickButton = () => {
    navigate("/subscription"); // Programmatic navigation
  };
  return (
    <div
      className="hero-wrapper"
      style={{
        position: "relative",
        height: "80vh",
        minHeight: "600px", // Added minimum height for smaller screens
        maxHeight: "900px", // Added maximum height for larger screens
      }}
    >
      <Container
        fluid
        className="hero-section"
        style={{
          backgroundColor: "#90d5df",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Main Content */}
        <Row className="align-items-center h-100 g-0">
          <Col lg={6} className="order-lg-1 order-2 position-relative ">
            <Image
              src={MaryamMuazImage}
              alt="Maryam & Muaz"
              fluid
              className="img-fluid"
              style={{
                maxHeight: "40vh",
                minHeight: "200px", 
                marginBottom: "0.5rem",
                position: "relative",
                zIndex: 2,
                width: "auto",
              
              }}
            />
            <div
              style={{
                position: "relative",
                height: "120px",
                minHeight: "80px", 
                zIndex: 2,
              }}
            >
              <Image
                src={DecorativeImage}
                alt="Decorative element"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  maxWidth: "950px", 
                  width: "auto", 
                  marginTop: "-1rem",
                }}
              />
            </div>
          </Col>

          <Col
            lg={6}
            className="text-center text-lg-start px-4 px-lg-5 order-lg-2 order-1"
            style={{ zIndex: 2 }}
          >
            <div className="mb-4">
              <h1
                className="display-3 fw-bold text-uppercase mb-3"
                style={{ color: "#2a5f73" }}
              >
                MARYAM & MUAZ
              </h1>
              <h2 className="display-5 mb-3" style={{ color: "#2a5f73" }}>
                Explore Islam with Maryam & Muaz
              </h2>
              <p className="lead fs-3" style={{ color: "#2a5f73" }}>
                Discover Faith in Every Episode!
              </p>
            </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Button
                variant="primary"
                size="lg"
                className="px-4 py-3 fw-bold"
                style={{
                  backgroundColor: "#2a5f73",
                  border: "none",
                  minWidth: "160px", 
                }}
              >
                Learn More
              </Button>
              <Button
              onClick={handleClickButton}
                variant="outline-light"
                size="lg"
                className="px-4 py-3 fw-bold"
                style={{
                  color: "#2a5f73",
                  borderColor: "#2a5f73",
                  minWidth: "160px", 
                }}
              >
                Subscribe
              </Button>
            </div>
          </Col>
        </Row>

        {/* Gradient Inside Container */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20%",
            maxHeight: "200px", // Added maximum height
            background:
              "linear-gradient(to bottom, rgba(47, 170, 64, 1) 0%, rgba(11, 165, 18, 0.7) 100%)",
            zIndex: 1,
          }}
        ></div>
      </Container>
      
    </div>
  );
};

export default HeroSection;