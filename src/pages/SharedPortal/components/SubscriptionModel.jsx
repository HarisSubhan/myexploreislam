import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const SubscriptionModel = () => {
  return (
    <>
      <Container fluid className="features-container">
        <Row className="align-items-stretch">
          {/* Left Column - Features List */}
          <Col md={6} className="left-column p-5">
            <h2 className="mb-4">Learning Platform Features</h2>
            <ul className="feature-list">
              <li className="mb-3">
                Anytime, Anywhere Access: Kids can watch videos on any device,
                at their convenience.
              </li>
              <li className="mb-3">
                Offline Learning: Videos can be downloaded within the app for
                offline access, worksheets can be done offline.
              </li>
              <li className="mb-3">
                Interactive Content: The platform includes engaging activities
                such as quizzes, worksheets, "Match the Picture" challenges,
                "Match the Name to the Revealed Book," "Fill in the Blanks" &
                more to make learning fun and interactive
              </li>
            </ul>
          </Col>

          {/* Right Column - Background Image */}
          <Col md={6} className="right-column p-0">
            <p className="lead mb-4">Subscription Model</p>
            <p>$39/Model</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SubscriptionModel;
