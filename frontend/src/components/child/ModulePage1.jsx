import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Image } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesId, videoId } = useParams(); // Fixed: use seriesId and videoId

  const handleNext = () => {
    // FIXED: Use correct path structure
    navigate(`/child/series/${seriesId}/quiz/${videoId}`);
  };

  const handleBack = () => {
    // FIXED: Use correct path structure
    navigate(`/child/series/${seriesId}/watch/${videoId}`);
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      {/* Lesson Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        PRACTICE ACTIVITY
      </h4>

      {/* Main Image */}
      <div className="d-flex justify-content-center mb-3">
        <Image
          src="/frontend/src/assets/images/c.png" // Replace with your actual image path
          alt="Learning Activity"
          fluid
          style={{
            maxWidth: "600px",
            borderRadius: "10px",
            border: "2px solid #ddd",
          }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/600x400/667eea/ffffff?text=Practice+Activity";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="text-center mb-4">
        <h5 style={{ color: "#ff1493" }}>Practice What You Learned</h5>
        <p className="text-muted">
          This activity will help reinforce the concepts you just learned in the
          video. Take your time and think carefully about each question.
        </p>
      </div>

      {/* Activity Instructions */}
      <div
        className="bg-light p-4 rounded-3 mb-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <h6 className="fw-bold mb-3">📝 Activity Instructions:</h6>
        <ul className="mb-0">
          <li>Review the key concepts from the video</li>
          <li>Complete the practice exercises</li>
          <li>Think about real-life applications</li>
          <li>Prepare for the quiz in the next step</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <Button
          onClick={handleBack}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
          }}
        >
          <FaArrowLeft className="me-2" />
          BACK TO VIDEO
        </Button>

        <Button
          onClick={handleNext}
          style={{
            background: "linear-gradient(135deg, #ff1493 0%, #3a86ff 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
          }}
        >
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModulePage1;
