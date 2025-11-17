import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation();

  console.log("🔍 ModulePage1 - Params:", { seriesSlug });
  console.log("🔍 ModulePage1 - Location state:", location.state);
  console.log("🔍 ModulePage1 - Full URL:", window.location.href);

  const handleNext = () => {
    navigate(`quiz`, {
      state: location.state,
    });
  };

  const handleBack = () => {
    navigate(`introduction`, {
      state: location.state,
    });
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      <Alert variant="info" className="text-center">
        <h4>🔍 Debug Info</h4>
        <p>Series Slug: {seriesSlug}</p>
        <p>Has State Data: {location.state ? "Yes" : "No"}</p>
        <p>Current Path: {window.location.pathname}</p>
      </Alert>

      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        PRACTICE ACTIVITY - PAGE 1
      </h4>

      <div className="text-center mb-4">
        <p className="text-muted">
          This is the practice activity page. If you can see this, ModulePage1
          is working!
        </p>
      </div>

      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <Button variant="secondary" onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          BACK TO INTRODUCTION
        </Button>

        <Button variant="primary" onClick={handleNext}>
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModulePage1;
