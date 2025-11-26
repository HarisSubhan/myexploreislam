import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";

const ModuleCompletion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Trigger confetti animation on component mount
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    navigate(`/child/series/series/${id}`);
  };

  const handleRetakeQuiz = () => {
    navigate(`/child/series/series/${id}/quiz`);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f7ff 0%, #c8e8ff 100%)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
      className="d-flex align-items-center"
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Confetti animation */}
            {showConfetti && (
              <div className="confetti-container">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      background: [
                        "#ff1493",
                        "#3a86ff",
                        "#ff9e00",
                        "#2ec4b6",
                        "#e71d36",
                      ][Math.floor(Math.random() * 5)],
                    }}
                  />
                ))}
              </div>
            )}

            <Card
              className="border-0 shadow-lg text-center p-4 p-md-5"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              {/* Decorative elements */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "6px",
                  background:
                    "linear-gradient(90deg, #ff1493, #3a86ff, #ff9e00)",
                }}
              />

              <div className="position-relative">
                <div
                  className="mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "100px",
                    height: "100px",
                    background:
                      "linear-gradient(135deg, #ff9e00 0%, #ff1493 100%)",
                    borderRadius: "50%",
                    fontSize: "3rem",
                  }}
                >
                  🎓
                </div>

                <Badge
                  bg="success"
                  className="position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Completed
                </Badge>
              </div>

              <h1
                className="fw-bold mb-3"
                style={{
                  background: "linear-gradient(90deg, #ff1493, #3a86ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Congratulations!
              </h1>

              <p className="text-muted mb-4 fs-5">
                You've successfully completed the{" "}
                <strong>What is Islam?</strong> module. Great job on sticking
                with it and expanding your knowledge!
              </p>

              {/* Achievement metrics */}
              <Row className="mb-4 text-center">
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3 className="fw-bold mb-1" style={{ color: "#3a86ff" }}>
                      100%
                    </h3>
                    <p className="mb-0 small">Completion</p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3 className="fw-bold mb-1" style={{ color: "#ff1493" }}>
                      3/3
                    </h3>
                    <p className="mb-0 small">Questions Correct</p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3 className="fw-bold mb-1" style={{ color: "#ff9e00" }}>
                      ★
                    </h3>
                    <p className="mb-0 small">Perfect Score</p>
                  </div>
                </Col>
              </Row>

              {/* Achievements section */}
              <div className="bg-light p-4 rounded-3 mb-4">
                <h5 className="fw-semibold mb-3" style={{ color: "#ff1493" }}>
                  What You've Achieved:
                </h5>
                <Row>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                      <span>Mastered key concepts</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                      <span>Completed interactive exercises</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                      <span>Passed the knowledge check</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                      <span>Gained practical understanding</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Action buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <button
                  onClick={handleRetakeQuiz}
                  className="btn btn-outline-primary px-4 py-2 rounded-2"
                  style={{ borderWidth: "2px", fontWeight: "600" }}
                >
                  Retake Quiz
                </button>
                <button
                  onClick={handleFinish}
                  className="btn px-4 py-2 rounded-2"
                  style={{
                    background: "linear-gradient(90deg, #ff1493, #3a86ff)",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                  }}
                >
                  Finish Module
                </button>
              </div>
            </Card>

            {/* Additional encouragement */}
            <p className="text-center text-muted mt-4">
              Ready to continue your learning journey? Explore more modules in
              your series!
            </p>
          </Col>
        </Row>
      </Container>

      {/* Confetti animation styles */}
      <style>
        {`
          .confetti-container {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1000;
            pointer-events: none;
          }
          
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0;
            animation: fall 3s linear forwards;
          }
          
          @keyframes fall {
            0% {
              opacity: 1;
              transform: translateY(-10px) rotate(0deg);
            }
            100% {
              opacity: 0;
              transform: translateY(100vh) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ModuleCompletion;
