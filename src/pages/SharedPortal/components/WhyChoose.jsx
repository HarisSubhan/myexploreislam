import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import star from "@images/Star___Moon_Drops.png";

const WhyChoose = () => {
  const features = [
    {
      title: "Fun & Interactive Learning",
      color: "#f95e1a", // orange
      description:
        "Kids enjoy & learn from animated cartoons, quizzes, and worksheets.",
    },
    {
      title: "Easy for Parents",
      color: "#ff6b6b", // red/orange
      description: "Track your child's progress in real time.",
    },
    {
      title: "Authentic & Reliable",
      color: "#e86f0b", // darker orange
      description: "Content is based on Quran and authentic Hadith.",
    },
  ];

  return (
    <Container
      fluid
      className="p-0 d-flex"
      style={{
        backgroundColor: "#e7fcff",
        // minHeight: "100vh", // Ensures full viewport height
      }}
    >
      <Row className="g-0 w-100">
        {/* Left Column */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ padding: "2rem" }}
        >
          {/* Decorative Image */}
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "300px",
              background: `url(${star}) no-repeat center center`,
              backgroundSize: "contain",
              marginBottom: "2rem",
            }}
          />
          {/* Heading Text */}
          <div className="text-center">
            <h1
              className="fw-bold"
              style={{ color: "#fb5607", fontSize: "4rem" }}
            >
              Why Choose <br />
              Explore Islam?
            </h1>
          </div>
        </Col>

        {/* Right Column - Features */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column "
          style={{ padding: "2rem" }}
        >
          {features.map((feature, index) => (
            <div key={index} className="mb-4 text-center text-md-start">
              <p className="mb-1" style={{ fontSize: "1.1rem" }}>
                <span style={{ color: "#0f5132", fontSize: "2rem" }}>✔</span>{" "}
                <span
                  style={{
                    color: feature.color,
                    fontWeight: "bold",
                  }}
                >
                  {feature.title}
                </span>{" "}
                – <span className="text-dark">{feature.description}</span>
              </p>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default WhyChoose;
