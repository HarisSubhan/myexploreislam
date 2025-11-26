import React from "react";
import { Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ModuleIntroductionPage2 = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // go back to previous lesson page
  };

  const handleNext = () => {
    navigate("/child/module/series/1/introduction?page=3"); // next lesson
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      {/* Lesson Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        LESSON 1 - WHAT IS ISLAM?
      </h4>

      {/* Main Image */}
      <div className="d-flex justify-content-center mb-3">
        <Image
          src="/images/maryam-muaz.png" // <-- replace with your actual image path
          alt="Maryam & Muaz"
          fluid
          style={{
            maxWidth: "600px",
            borderRadius: "10px",
            border: "2px solid #ddd",
          }}
        />
      </div>

      {/* Caption */}
      <p
        className="text-center fw-bold"
        style={{ color: "#ff1493", marginBottom: "40px" }}
      >
        Maryam & Muaz | What is Islam?
      </p>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between">
        <Button
          onClick={handleBack}
          style={{
            background: "#f0f6ff",
            border: "none",
            color: "#ff1493",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          <FaArrowLeft className="me-2" />
          BACK
        </Button>

        <Button
          onClick={handleNext}
          style={{
            background: "#f0f6ff",
            border: "none",
            color: "#ff1493",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          NEXT
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModuleIntroductionPage2;
