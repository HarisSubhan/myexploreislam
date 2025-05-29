import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const InteractiveLearning = () => {
  return (
    <Container fluid className="py-4" style={{
      backgroundColor: "#06d6a0",
      fontFamily: "'Poppins', sans-serif",
      whiteSpace: 'normal',
    }}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <p className="text-center fw-bold text-uppercase  mb-0">
            An Interactive Learning Platform for Children: Animated Cartoons, Worksheets, E-books & More — All in One Place
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default InteractiveLearning;
