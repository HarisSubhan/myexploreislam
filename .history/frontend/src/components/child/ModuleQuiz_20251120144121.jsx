import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ProgressBar,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { submitQuizApi, getQuizByIdVideoAPi } from "./../../services/quizApi";

const ModuleQuiz = () => {
  const navigate = useNavigate();
  const { seriesSlug, videoId } = useParams();
  const location = useLocation();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [childId] = useState(1);

  const videoData = location.state?.currentVideo || location.state?.videoData;

  useEffect(() => {
    if (videoId) {
      fetchQuizData();
    } else {
      setError("No video ID provided for quiz");
      setLoading(false);
    }
  }, [videoId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      const quizData = await getQuizByIdVideoAPi(videoId);

      // Handle "Quiz not found for this video" error
      if (quizData?.error === "Quiz not found for this video") {
        setError("Quiz not found for this video");
        setQuestions([]);
        return;
      }

      if (quizData?.questions?.length > 0) {
        const processedQuestions = quizData.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(
            (opt) => opt !== null && opt !== undefined
          ),
          correctAnswer: getCorrectAnswerIndex(q.correct_option),
        }));

        setQuestions(processedQuestions);
        setQuizId(quizData.id || 1);
      } else {
        setError("No quiz questions available for this video");
        setQuestions([]);
      }
    } catch (err) {
      // Handle API errors and check for the specific error message
      if (err.response?.data?.error === "Quiz not found for this video" || 
          err.message?.includes("Quiz not found")) {
        setError("Quiz not found for this video");
      } else {
        setError("Failed to load quiz. Please try again.");
      }
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getCorrectAnswerIndex = (correctOption) => {
    const options = { a: 0, b: 1, c: 2, d: 3 };
    return options[correctOption] || 0;
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(97 + index);
  };

  const handleAnswerSelect = (index) => {
    if (!showFeedback && !loading) {
      setSelectedAnswer(index);
    }
  };

  const submitQuizResults = async (finalScore, answers) => {
    try {
      await submitQuizApi({
        quiz_id: quizId,
        child_id: childId,
        score: finalScore,
        answers: answers,
        video_id: videoId,
      });
    } catch (err) {
      // Silent fail - don't show error to user
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    const currentAnswers = questions.slice(0, currentQuestion + 1).map((q) => ({
      question_id: q.id,
      selected_option: getOptionLetter(selectedAnswer),
    }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 2000);
    } else {
      const finalScore = correct ? score + 1 : score;
      const allAnswers = [...currentAnswers];

      setTimeout(async () => {
        await submitQuizResults(finalScore, allAnswers);

        navigate(`/child/module/${seriesSlug}/completion/${videoId}`, {
          state: {
            score: finalScore,
            totalQuestions: questions.length,
            videoData: videoData,
            videoId: videoId,
          },
        });
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate(`/child/module/${seriesSlug}/page1/${videoId}`, {
        state: {
          currentVideo: videoData,
          videoId: videoId,
        },
      });
    }
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #f8fbff 0%, #e6f0ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading quiz...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="py-5 d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #f8fbff 0%, #e6f0ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Alert 
          variant={
            error === "Quiz not found for this video" ? "warning" : "danger"
          } 
          className="text-center"
        >
          <h5>
            {error === "Quiz not found for this video" 
              ? "No Quiz Available" 
              : "Quiz Loading Error"
            }
          </h5>
          <p>{error}</p>
          <div className="mt-3">
            {error !== "Quiz not found for this video" && (
              <Button variant="primary" onClick={fetchQuizData}>
                Try Again
              </Button>
            )}
            <Button
              variant={error === "Quiz not found for this video" ? "primary" : "outline-primary"}
              className={error !== "Quiz not found for this video" ? "ms-2" : ""}
              onClick={() =>
                navigate(`/child/module/${seriesSlug}/page1/${videoId}`, {
                  state: { videoData, videoId },
                })
              }
            >
              Back to Lesson
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container
        fluid
        className="py-5 d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #f8fbff 0%, #e6f0ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Alert variant="warning" className="text-center">
          <h5>No Quiz Available</h5>
          <p>No questions available for this lesson.</p>
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/child/module/${seriesSlug}/page1/${videoId}`, {
                state: { videoData, videoId },
              })
            }
          >
            Back to Lesson
          </Button>
        </Alert>
      </Container>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

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
          KNOWLEDGE CHECK
        </h4>
        <p className="text-muted">Test your understanding of the lesson</p>
        {videoData && (
          <p className="text-muted small">
            Video: <strong>{videoData.title}</strong>
          </p>
        )}
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <ProgressBar
            now={progress}
            style={{ width: "60%", height: "12px" }}
            variant="primary"
          />
          <span className="text-muted">{Math.round(progress)}%</span>
        </div>

        <div className="text-center mb-3">
          <small className="text-muted">
            Current Score: {score} / {currentQuestion}
          </small>
        </div>

        <div className="mb-5">
          <h3 className="fw-semibold text-dark mb-4">{currentQ.question}</h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              let borderClass = "border-light-subtle";
              let bgClass = "white";

              if (isSelected) {
                if (showFeedback) {
                  borderClass = isCorrect ? "border-success" : "border-danger";
                  bgClass = isCorrect ? "#d1f2eb" : "#f8d7da";
                } else {
                  borderClass = "border-primary";
                  bgClass = "#e3f2fd";
                }
              }

              return (
                <div
                  key={index}
                  className={`p-3 rounded-3 border ${borderClass} ${
                    !showFeedback && "hover-cursor"
                  }`}
                  style={{
                    transition: "all 0.2s ease",
                    cursor: !showFeedback ? "pointer" : "default",
                    backgroundColor: bgClass,
                  }}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className={`d-flex justify-content-center align-items-center me-3 rounded-circle ${
                        isSelected
                          ? showFeedback
                            ? isCorrect
                              ? "bg-success"
                              : "bg-danger"
                            : "bg-primary"
                          : "bg-light border"
                      }`}
                      style={{
                        width: "28px",
                        height: "28px",
                        minWidth: "28px",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      {isSelected && showFeedback ? (
                        <span className="text-white">
                          {isCorrect ? "✓" : "✗"}
                        </span>
                      ) : (
                        <span
                          className={isSelected ? "text-white" : "text-dark"}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span className="text-dark flex-grow-1">{option}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {showFeedback && (
            <Alert
              variant={isCorrect ? "success" : "danger"}
              className="mt-4 mb-0"
            >
              <strong>{isCorrect ? "✓ Correct! " : "✗ Incorrect. "}</strong>
              {isCorrect
                ? "Well done! You understand this concept."
                : `The correct answer is: ${
                    currentQ.options[currentQ.correctAnswer]
                  }`}
            </Alert>
          )}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <Button
            onClick={handleBack}
            variant="outline-primary"
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || showFeedback}
            variant={selectedAnswer === null ? "outline-secondary" : "primary"}
            className="d-flex align-items-center px-4"
          >
            {currentQuestion < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
            <FaArrowRight className="ms-2" />
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default ModuleQuiz;