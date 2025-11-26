import React from "react";
import { FaVolumeUp } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  console.log("Current path:", location.pathname);
  console.log("Module ID:", id);

  const handleNext = () => {
    // Use absolute path with /child prefix
    navigate(`/child/series/series/${id}/page1`);
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      {/* Title */}
      <h2 className="fw-bold text-center mb-4" style={{ color: "#ff1493" }}>
        Module 1 - Introduction to Islam
      </h2>

      {/* Lesson title */}
      <h4 className="fw-bold mb-4" style={{ color: "#3a86ff" }}>
        LESSON 1 - WHAT IS ISLAM?
      </h4>

      {/* Lesson Content */}
      <Card
        className="p-4 border-0 shadow-sm"
        style={{ borderRadius: "15px", background: "#fff" }}
      >
        <p style={{ color: "#ff1493", fontSize: "1.1rem", lineHeight: "1.7" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <p style={{ color: "#ff1493", fontSize: "1.1rem", lineHeight: "1.7" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam.
        </p>

        {/* Voice Note */}
        <div className="d-flex justify-content-end align-items-center mt-3">
          <FaVolumeUp size={30} color="#3a86ff" className="me-2" />
        </div>
      </Card>

      {/* Next Button */}
      <div className="text-end mt-4">
        <Button
          onClick={handleNext}
          style={{
            background: "transparent",
            border: "none",
            color: "#ff1493",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          NEXT →
        </Button>
      </div>
    </Container>
  );
};

export default ModuleIntroduction;
