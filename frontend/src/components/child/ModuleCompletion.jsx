import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaTrophy, FaShare, FaHome, FaList, FaArrowLeft } from "react-icons/fa";

const ModuleCompletion = () => {
  const navigate = useNavigate();
  const { seriesSlug, videoId } = useParams(); // ✅ FIXED: Use seriesSlug instead of seriesId
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  // Get score and total questions from navigation state
  const score = location.state?.score || 0;
  const totalQuestions = location.state?.totalQuestions || 3;
  const quizId = location.state?.quizId;
  const seriesData = location.state?.seriesData;
  const videoData = location.state?.videoData;

  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfectScore = score === totalQuestions;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    // ✅ FIXED: Navigate back to series detail page
    if (seriesSlug) {
      navigate(`/child/module/${seriesSlug}`);
    } else {
      navigate("/child/module");
    }
  };

  const handleRetakeQuiz = () => {
    // ✅ FIXED: Navigate back to quiz with correct parameters
    if (seriesSlug && videoId) {
      navigate(`/child/module/${seriesSlug}/quiz/${videoId}`, {
        state: {
          currentVideo: videoData,
          seriesData: seriesData,
          videoId: videoId,
        },
      });
    }
  };

  const handleGoHome = () => {
    navigate("/child");
  };

  const handleBackToSeries = () => {
    if (seriesSlug) {
      navigate(`/child/module/${seriesSlug}`);
    } else {
      navigate("/child/module");
    }
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "#2ec4b6";
    if (percentage >= 60) return "#ff9e00";
    return "#e71d36";
  };

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect score! You're a star! 🌟";
    if (percentage >= 80)
      return "Excellent work! You've mastered most concepts!";
    if (percentage >= 60) return "Good job! You understand the main concepts!";
    return "Keep practicing! You'll get better with more effort!";
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
      className="d-flex align-items-center"
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Back Button */}
            <div className="mb-3">
              <Button
                variant="outline-light"
                onClick={handleBackToSeries}
                className="d-flex align-items-center"
              >
                <FaArrowLeft className="me-2" />
                Back to Series
              </Button>
            </div>

            {/* Confetti animation */}
            {showConfetti && isPerfectScore && (
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
                    width: "120px",
                    height: "120px",
                    background: isPerfectScore
                      ? "linear-gradient(135deg, #ff9e00 0%, #ff1493 100%)"
                      : `linear-gradient(135deg, ${getScoreColor()} 0%, #3a86ff 100%)`,
                    borderRadius: "50%",
                    fontSize: "3.5rem",
                    boxShadow: `0 8px 25px ${getScoreColor()}30`,
                  }}
                >
                  <FaTrophy className="text-white" />
                </div>

                <Badge
                  bg={
                    isPerfectScore
                      ? "success"
                      : percentage >= 60
                        ? "warning"
                        : "danger"
                  }
                  className="position-absolute"
                  style={{ top: "10px", right: "10px", fontSize: "0.9rem" }}
                >
                  {isPerfectScore
                    ? "Perfect!"
                    : percentage >= 60
                      ? "Passed"
                      : "Needs Practice"}
                </Badge>
              </div>

              <h1
                className="fw-bold mb-3 display-4"
                style={{
                  background: "linear-gradient(90deg, #ff1493, #3a86ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {isPerfectScore ? "Congratulations!" : "Quiz Completed!"}
              </h1>

              <p className="text-muted mb-4 fs-5">{getScoreMessage()}</p>

              {/* Video Info */}
              {videoData && (
                <div className="bg-light p-3 rounded-3 mb-4">
                  <h6 className="fw-bold mb-2">Completed:</h6>
                  <p className="mb-1">{videoData.title}</p>
                  {seriesData && (
                    <small className="text-muted">
                      Series: {seriesData.name}
                    </small>
                  )}
                </div>
              )}

              {/* Achievement metrics */}
              <Row className="mb-4 text-center">
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3 className="fw-bold mb-1" style={{ color: "#3a86ff" }}>
                      {percentage}%
                    </h3>
                    <p className="mb-0 small text-muted">Score</p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3
                      className="fw-bold mb-1"
                      style={{ color: getScoreColor() }}
                    >
                      {score}/{totalQuestions}
                    </h3>
                    <p className="mb-0 small text-muted">Correct Answers</p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 bg-light rounded-3">
                    <h3 className="fw-bold mb-1" style={{ color: "#ff9e00" }}>
                      {percentage >= 80
                        ? "★★★"
                        : percentage >= 60
                          ? "★★☆"
                          : "★☆☆"}
                    </h3>
                    <p className="mb-0 small text-muted">Performance</p>
                  </div>
                </Col>
              </Row>

              {/* Action buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline-primary"
                  className="px-4 py-3 d-flex align-items-center justify-content-center"
                  style={{ fontWeight: "600" }}
                >
                  <FaList className="me-2" />
                  Retake Quiz
                </Button>
                <Button
                  onClick={handleFinish}
                  className="px-4 py-3 d-flex align-items-center justify-content-center"
                  style={{
                    background: "linear-gradient(90deg, #ff1493, #3a86ff)",
                    border: "none",
                    fontWeight: "600",
                  }}
                >
                  <FaShare className="me-2" />
                  {isPerfectScore ? "Next Lesson" : "Continue Learning"}
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline-secondary"
                  className="px-4 py-3 d-flex align-items-center justify-content-center"
                  style={{ fontWeight: "600" }}
                >
                  <FaHome className="me-2" />
                  Back Home
                </Button>
              </div>

              {/* Debug Info */}
              <div className="mt-4 text-center">
                <small className="text-muted">
                  Series: {seriesSlug || "None"} | Video ID: {videoId || "None"}
                </small>
              </div>
            </Card>
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
            width: 12px;
            height: 12px;
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
