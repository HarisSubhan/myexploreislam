import React, { useState } from "react";
import { Container, Card, ProgressBar, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ModuleQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = [
    {
      question: "What is the main concept covered in this module?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1, // Index of correct option
    },
    {
      question: "Which of these is a key principle discussed?",
      options: ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
      correctAnswer: 2,
    },
    {
      question: "What was the main example used in the lesson?",
      options: ["Example A", "Example B", "Example C", "Example D"],
      correctAnswer: 0,
    },
  ];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    if (showFeedback) setShowFeedback(false);
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        navigate(`/child/module/series/${id}/completion`);
      }
    }, 1500);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate(`/child/module/series/${id}/page1`);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Container
      fluid
      className="py-5 d-flex flex-column justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f8fbff 0%, #e6f0ff 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="text-center mb-4">
        <h4 className="fw-bold" style={{ color: "#3a86ff" }}>
          LESSON 1 - WHAT IS ISLAM?
        </h4>
        <p className="text-muted">Test your knowledge from the lesson</p>
      </div>

      <Card
        className="p-4 border-0 shadow-lg mx-auto"
        style={{
          borderRadius: "20px",
          background: "#fff",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* Progress section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <ProgressBar
            now={progress}
            style={{ width: "60%", height: "10px" }}
            variant="primary"
          />
          <span className="text-muted">{Math.round(progress)}%</span>
        </div>

        {/* Question section */}
        <div className="mb-5">
          <h3 className="fw-semibold text-dark mb-4">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-3 border ${
                  selectedAnswer === index
                    ? showFeedback
                      ? isCorrect && selectedAnswer === index
                        ? "border-success bg-light-success"
                        : selectedAnswer === index
                          ? "border-danger bg-light-danger"
                          : ""
                      : "border-primary bg-light-primary"
                    : "border-light-subtle"
                } 
                ${!showFeedback && "hover-cursor"}`}
                style={{
                  transition: "all 0.2s ease",
                  cursor: !showFeedback ? "pointer" : "default",
                }}
                onClick={() => !showFeedback && handleAnswerSelect(index)}
              >
                <div className="d-flex align-items-center">
                  <div
                    className={`d-flex justify-content-center align-items-center me-3 ${
                      selectedAnswer === index
                        ? showFeedback
                          ? isCorrect && selectedAnswer === index
                            ? "bg-success"
                            : selectedAnswer === index
                              ? "bg-danger"
                              : "bg-primary"
                          : "bg-primary"
                        : "bg-light border"
                    } 
                    rounded-circle`}
                    style={{
                      width: "24px",
                      height: "24px",
                      minWidth: "24px",
                    }}
                  >
                    {selectedAnswer === index && showFeedback ? (
                      isCorrect ? (
                        <span className="text-white">✓</span>
                      ) : (
                        <span className="text-white">✗</span>
                      )
                    ) : (
                      <span
                        className={
                          selectedAnswer === index ? "text-white" : "text-dark"
                        }
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  <label
                    className="text-dark mb-0 flex-grow-1"
                    style={{ cursor: !showFeedback ? "pointer" : "default" }}
                  >
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback alert */}
          {showFeedback && (
            <Alert
              variant={isCorrect ? "success" : "danger"}
              className="mt-4 mb-0"
            >
              {isCorrect
                ? "✓ Correct! Well done!"
                : "✗ Incorrect. The right answer is: " +
                  questions[currentQuestion].options[
                    questions[currentQuestion].correctAnswer
                  ]}
            </Alert>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 d-flex align-items-center rounded-3 border-0"
            style={{
              background: "#e9ecef",
              color: "#495057",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#dee2e6")}
            onMouseOut={(e) => (e.target.style.background = "#e9ecef")}
          >
            <span className="me-2">⬅</span> Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || showFeedback}
            className={`px-4 py-2 d-flex align-items-center rounded-3 border-0 ${
              selectedAnswer === null || showFeedback
                ? "bg-gray-400"
                : "bg-primary"
            }`}
            style={{
              color:
                selectedAnswer === null || showFeedback ? "#6c757d" : "white",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!(selectedAnswer === null || showFeedback)) {
                e.target.style.background = "#0b5ed7";
              }
            }}
            onMouseOut={(e) => {
              if (!(selectedAnswer === null || showFeedback)) {
                e.target.style.background = "#0d6efd";
              }
            }}
          >
            {currentQuestion < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
            <span className="ms-2">➡</span>
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default ModuleQuiz;
