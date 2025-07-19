import React, { useState } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ProgressBar,
  Image,
  Form,
} from "react-bootstrap";
import Banner from "./Banner";
import "./VideoThumbnails.css";
import { useParams } from "react-router-dom";

const QuizStart = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { quizid } = useParams();

  const questions = [
    {
      question: "The logo for luxury car maker Porsche features which animal?",
      options: [
        { id: "A", text: "Dog", correct: false },
        { id: "B", text: "Tiger", correct: false },
        { id: "C", text: "Cat", correct: false },
        { id: "D", text: "Horse", correct: true },
      ],
      image:
        "https://templates.seekviral.com/qzain/quiz/Quiz10/assets/images/Manthinking-bro.png",
      fact: "The Porsche logo features a rearing black horse from the Stuttgart city coat of arms.",
    },
    {
      question: "What year was the first Porsche 911 introduced?",
      options: [
        { id: "A", text: "1955", correct: false },
        { id: "B", text: "1963", correct: true },
        { id: "C", text: "1971", correct: false },
        { id: "D", text: "1982", correct: false },
      ],
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg",
      fact: "The Porsche 911 debuted in 1963 at the Frankfurt Motor Show.",
    },
    {
      question: "Which Porsche model is electric?",
      options: [
        { id: "A", text: "Cayenne", correct: false },
        { id: "B", text: "Taycan", correct: true },
        { id: "C", text: "Panamera", correct: false },
        { id: "D", text: "Macan", correct: false },
      ],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_FSc_YmIngfoALB46aPE44bkkIifCObUwUQ&s",
      fact: "The Taycan is Porsche's first all-electric sports car.",
    },
    {
      question: "What does 'GT' stand for in Porsche models?",
      options: [
        { id: "A", text: "Grand Touring", correct: true },
        { id: "B", text: "Gas Turbo", correct: false },
        { id: "C", text: "German Technology", correct: false },
        { id: "D", text: "Gear Transmission", correct: false },
      ],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_FSc_YmIngfoALB46aPE44bkkIifCObUwUQ&s",
      fact: "GT stands for Gran Turismo or Grand Touring in Italian and English respectively.",
    },
    {
      question: "Which color is most associated with Porsche?",
      options: [
        { id: "A", text: "Ferrari Red", correct: false },
        { id: "B", text: "BMW Blue", correct: false },
        { id: "C", text: "Porsche Green", correct: false },
        { id: "D", text: "Porsche Guards Red", correct: true },
      ],
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg",
      fact: "Guards Red is one of Porsche's signature colors since the 1980s.",
    },
  ];

  const handleAnswerSelect = (answerId) => {
    if (!showResult && !quizCompleted) {
      setSelectedAnswer(answerId);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect =
    selectedAnswer &&
    currentQuestion.options.find((opt) => opt.id === selectedAnswer)?.correct;

  if (quizCompleted) {
    return (
      <Container className="quiz-completed-container py-5 text-center">
        <Card className="shadow-sm p-4">
            <Card.
          <div className="mb-4">
            <div className="checkmark-circle mb-3">
              <span className="checkmark">✓</span>
            </div>
            <h2 className="text-success">Your answer has been submitted</h2>
            <p className="lead">Thank you for taking the Quiz!</p>
          </div>

          {!isSubscribed ? (
            <div className="subscribe-form mt-4">
              <h5>Stay updated with more quizzes</h5>
              <Form onSubmit={handleEmailSubmit} className="mt-3">
                <Form.Group controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-3"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Subscribe Now
                </Button>
              </Form>
            </div>
          ) : (
            <div className="text-success mt-3">
              <p>Thank you for subscribing!</p>
            </div>
          )}

          <Button
            variant="outline-secondary"
            className="mt-4"
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setQuizCompleted(false);
              setIsSubscribed(false);
            }}
          >
            Take Quiz Again
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="quiz-container py-4">
     

      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">
          Question {currentQuestionIndex + 1} of {questions.length}
        </small>
        <ProgressBar now={progress} style={{ width: "70%", height: "8px" }} />
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">{currentQuestion.question}</Card.Title>

          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <div className="options-container">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`option-item ${selectedAnswer === option.id ? "selected" : ""} 
                      ${showResult ? (option.correct ? "correct" : selectedAnswer === option.id ? "incorrect" : "") : ""}`}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <span className="option-letter">{option.id}</span>
                    <span className="option-text">{option.text}</span>
                    {showResult && option.correct && (
                      <span className="option-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </Col>

            <Col
              md={6}
              className="d-flex align-items-center justify-content-center"
            >
              <Image
                src={currentQuestion.image}
                alt="Quiz illustration"
                fluid
                className="quiz-image"
              />
            </Col>
          </Row>

          {showResult && (
            <div
              className={`result-message mt-3 p-3 ${isCorrect ? "text-success" : "text-danger"}`}
            >
              {isCorrect ? "Correct!" : "Incorrect!"} {currentQuestion.fact}
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-primary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </Button>

            {!showResult ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizStart;
