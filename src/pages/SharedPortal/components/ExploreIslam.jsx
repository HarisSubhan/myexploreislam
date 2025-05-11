import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import topLeftImage from "@images/MARYAM1.png";
import bottomRightImage from "@images/Muaz_Side_Page.png";

const ExploreIslam = () => {
  return (
    <Container
      fluid
      style={{ backgroundColor: "#e7fcff" }}
      className="position-relative py-lg-5 overflow-hidden"
    >
      {/* Top-left image (partially outside) */}
      <img
        src={bottomRightImage}
        alt="Decorative element"
        className="position-absolute d-none d-md-block"
        style={{
          top: "-10px",
          left: "-250px",
          width: "600px",
          zIndex: 1,
          transform: "rotate(20deg)",
          transformOrigin: "center center",
          opacity: 0.8,
        }}
      />

      {/* Bottom-right image (overlapping content) */}
      <img
        src={topLeftImage}
        alt="Decorative element"
        className="position-absolute d-none d-md-block"
        style={{
          bottom: "-50px",
          right: "-310px",
          width: "750px",
          zIndex: 1,
          transform: "rotate(-15deg)",
          transformOrigin: "center center",
          opacity: 0.8,
        }}
      />

      {/* Content */}
      <Row
        className="justify-content-center align-items-center g-4 px-3 px-lg-5 py-3 py-lg-5 position-relative"
        style={{ zIndex: 2 }}
      >
        <Col
          xs={12}
          md={6}
          lg={5}
          className="order-2 order-md-1 position-relative"
        >
          <div className="pe-lg-4">
            <p className="fs-5 fs-md-6 mb-4" style={{ lineHeight: "1.8" }}>
              My Explore Islam is an{" "}
              <strong className="fw-bold" style={{ color: "#f1066c" }}>
                interactive learning
              </strong>
              platform designed to teach kids about Islam through Animated
              Cartoons, Activities, Worksheets, Quizzes & More!
            </p>
            <p className="fs-5 fs-md-6" style={{ lineHeight: "1.8" }}>
              Our goal is to make Islamic education for kids{" "}
              <strong className="fw-bold" style={{ color: "#f1066c" }}>
                exciting
              </strong>
              ,{" "}
              <strong className="fw-bold" style={{ color: "#f1066c" }}>
                easy
              </strong>
              , and{" "}
              <strong className="fw-bold" style={{ color: "#f1066c" }}>
                accessible
              </strong>{" "}
              for children, all while ensuring authenticity through references
              from the Quran and Sunnah.
            </p>
          </div>
        </Col>

        <Col
          xs={12}
          md={6}
          lg={7}
          className="order-1 order-md-2 text-center text-md-start"
        >
          <h1
            className="display-3 display-lg-1 fw-bold mb-4"
            style={{ color: "#f1066c" }}
          >
            About <span className="d-block d-md-inline">Explore Islam</span>
          </h1>
        </Col>
      </Row>
    </Container>
  );
};

export default ExploreIslam;
