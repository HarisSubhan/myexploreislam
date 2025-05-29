import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import star from "@images/SideDesign.png";

const WhyChoose = () => {
  const features = [
    {
      title: "Fun & Interactive Learning",
      color: "#f95e1a",
      description:
        "Kids enjoy & learn from animated cartoons, quizzes, and worksheets.",
    },
    {
      title: "Easy for Parents",
      color: "#ff6b6b",
      description: "Track your child's progress in real time.",
    },
    {
      title: "Authentic & Reliable",
      color: "#e86f0b",
      description: "Content is based on Quran and authentic Hadith.",
    },
  ];

  return (
    <Container fluid className="p-0" style={{ backgroundColor: "#e7fcff", minHeight: "100vh" }}>
      <Row className="g-0" style={{ minHeight: "100vh" }}>
        
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100vh", padding: 0 }}
        >
          <img
            src={star}
            alt="Side Design"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
          <h1
            className="fw-bold text-center"
            style={{
              color: "#fb5607",
              fontSize: "3rem",
              lineHeight: 1.2,
              margin: "1rem 0 0 0",
              padding: 0,
            }}
          >
            Why Choose <br />
            Explore Islam?
          </h1>
        </Col>

        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center p-4"
          style={{ minHeight: "100vh" }}
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
