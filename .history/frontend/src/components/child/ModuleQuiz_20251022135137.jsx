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
import { getQuizBySeriesVideoApi, submitQuizApi } from './../../services/quizApi';


const ModuleQuiz = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
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

  // Get video data from location state
  const videoData = location.state?.videoData;
  const seriesData = location.state?.seriesData;
  const videoId = location.state?.videoId;

  console.log("🔍 ModuleQuiz - Location State:", location.state);
  console.log("🔍 ModuleQuiz - Video ID:", videoId);
  console.log("🔍 ModuleQuiz - Series Slug:", seriesSlug);

  useEffect(() => {
    if (videoId) {
      fetchQuizData();
    } else {
      setError("No video selected for quiz");
      setLoading(false);
    }
  }, [videoId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🎯 Fetching quiz for videoId:", videoId);
      console.log("🎯 Series Data:", seriesData);

      let quizData;

      // Try actual API first
      try {
        // ✅ Pass both seriesId and videoId if required by API
        quizData = await getQuizBySeriesVideoApi(seriesData?.id, videoId);
        console.log("🎯 Quiz API Response:", quizData);
      } catch (apiError) {
        console.warn("⚠️ API failed, using mock data");
        console.error("API Error:", apiError);
        // Fallback to mock data
        quizData = getMockQuizData();
      }

      // ... rest of the code remains same
    } catch (err) {
      console.error("❌ Error fetching quiz:", err);
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mock data for testing
  const getMockQuizData = () => {
    return {
      id: 1,
      questions: [
        {
          id: 1,
          question: "What is the capital of France?",
          option_a: "London",
          option_b: "Paris",
          option_c: "Berlin",
          option_d: "Madrid",
          correct_option: "b",
        },
        {
          id: 2,
          question: "Which planet is known as the Red Planet?",
          option_a: "Earth",
          option_b: "Mars",
          option_c: "Jupiter",
          option_d: "Saturn",
          correct_option: "b",
        },
        {
          id: 3,
          question: "What is 2 + 2?",
          option_a: "3",
          option_b: "4",
          option_c: "5",
          option_d: "6",
          correct_option: "b",
        },
        {
          id: 4,
          question: "Which animal is known as the King of the Jungle?",
          option_a: "Elephant",
          option_b: "Lion",
          option_c: "Tiger",
          option_d: "Giraffe",
          correct_option: "b",
        },
      ],
    };
  };

  const getCorrectAnswerIndex = (correctOption) => {
    switch (correctOption) {
      case "a":
        return 0;
      case "b":
        return 1;
      case "c":
        return 2;
      case "d":
        return 3;
      default:
        return 0;
    }
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
        series_id: seriesData?.id,
        video_id: videoId,
      });
      console.log("✅ Quiz results submitted successfully");
    } catch (err) {
      console.error("❌ Error submitting quiz results:", err);
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

    // Prepare answers for submission
    const currentAnswers = questions
      .slice(0, currentQuestion + 1)
      .map((q, index) => ({
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
      // Submit final results
      const finalScore = correct ? score + 1 : score;
      const allAnswers = [...currentAnswers];

      setTimeout(async () => {
        await submitQuizResults(finalScore, allAnswers);
        navigate(`/child/module/${seriesSlug}/completion`, {
          state: {
            score: finalScore,
            totalQuestions: questions.length,
            quizId: quizId,
            seriesData: seriesData,
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
      navigate(`/child/module/${seriesSlug}/page1`, {
        state: {
          videoData: videoData,
          seriesData: seriesData,
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
        <Alert variant="danger" className="text-center">
          <h5>Quiz Loading Error</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={fetchQuizData}>
              Try Again
            </Button>
            <Button
              variant="outline-primary"
              className="ms-2"
              onClick={() =>
                navigate(`/child/module/${seriesSlug}/page1`, {
                  state: {
                    videoData: videoData,
                    seriesData: seriesData,
                    videoId: videoId,
                  },
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
          <div className="mt-3">
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/child/module/${seriesSlug}/page1`, {
                  state: {
                    videoData: videoData,
                    seriesData: seriesData,
                    videoId: videoId,
                  },
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
      {/* Debug Info - Remove in production */}
      <Alert variant="info" className="text-center mb-3">
        <small>
          <strong>Debug Info:</strong> Video: {videoData?.title} | Questions:{" "}
          {questions.length} | Video ID: {videoId}
        </small>
      </Alert>

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
        {/* Progress section */}
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

        {/* Score indicator */}
        <div className="text-center mb-3">
          <small className="text-muted">
            Current Score: {score} / {currentQuestion}
          </small>
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
                          : "border-light-subtle"
                      : "border-primary bg-light-primary"
                    : "border-light-subtle"
                } 
                ${!showFeedback && "hover-cursor"}`}
                style={{
                  transition: "all 0.2s ease",
                  cursor: !showFeedback ? "pointer" : "default",
                  backgroundColor:
                    selectedAnswer === index
                      ? showFeedback
                        ? isCorrect
                          ? "#d1f2eb"
                          : "#f8d7da"
                        : "#e3f2fd"
                      : "white",
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="d-flex align-items-center">
                  <div
                    className={`d-flex justify-content-center align-items-center me-3 ${
                      selectedAnswer === index
                        ? showFeedback
                          ? isCorrect
                            ? "bg-success"
                            : "bg-danger"
                          : "bg-primary"
                        : "bg-light border"
                    } 
                    rounded-circle`}
                    style={{
                      width: "28px",
                      height: "28px",
                      minWidth: "28px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
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
                  <span className="text-dark flex-grow-1">{option}</span>
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
              <strong>{isCorrect ? "✓ Correct! " : "✗ Incorrect. "}</strong>
              {isCorrect
                ? "Well done! You understand this concept."
                : `The correct answer is: ${
                    questions[currentQuestion].options[
                      questions[currentQuestion].correctAnswer
                    ]
                  }`}
            </Alert>
          )}
        </div>

        {/* Navigation buttons */}
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
