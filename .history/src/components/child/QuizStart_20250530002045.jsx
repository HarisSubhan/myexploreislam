import React, { useState } from "react";
import { Container, Card, ListGroup, Button, Alert } from "react-bootstrap";

const QuizStart = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNextQuestion, setShowNextQuestion] = useState(false);

  const handleAnswerSelect = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    setShowNextQuestion(true);
  };

  const questions = [
    {
      question: "The logo for luxury car maker Porsche features which animal?",
      options: [
        { id: "A", text: "Dog", correct: false },
        { id: "B", text: "Tiger", correct: false },
        { id: "C", text: "Cat", correct: false },
        { id: "D", text: "Horse", correct: true },
      ],
      fact: "The Porsche logo features a rearing black horse (from the Stuttgart city coat of arms) surrounded by red and black stripes and antlers (from the Württemberg coat of arms). Stuttgart was founded as a horse breeding center, which explains the horse symbol.",
    },
    {
      question: "What year was the first Porsche 911 introduced?",
      options: [
        { id: "A", text: "1955", correct: false },
        { id: "B", text: "1963", correct: true },
        { id: "C", text: "1971", correct: false },
        { id: "D", text: "1982", correct: false },
      ],
      fact: "The Porsche 911 was first introduced in 1963 at the Frankfurt Motor Show as the successor to the Porsche 356.",
    },
  ];

  const currentQuestionIndex = showNextQuestion ? 1 : 0;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Header as="h5" className="bg-dark text-white">
          Porsche Trivia Quiz
        </Card.Header>
        <Card.Body>
          <Card.Title>{currentQuestion.question}</Card.Title>

          <ListGroup className="mb-3">
            {currentQuestion.options.map((option) => (
              <ListGroup.Item
                key={option.id}
                action
                active={selectedAnswer === option.id}
                onClick={() => handleAnswerSelect(option.id)}
                variant={
                  isSubmitted
                    ? option.correct
                      ? "success"
                      : selectedAnswer === option.id
                        ? "danger"
                        : ""
                    : ""
                }
                disabled={isSubmitted}
              >
                {option.id}. {option.text}
                {isSubmitted && option.correct && (
                  <span className="float-end">✓ Correct</span>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {!isSubmitted ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <>
              <Alert
                variant={
                  currentQuestion.options.find((o) => o.id === selectedAnswer)
                    ?.correct
                    ? "success"
                    : "danger"
                }
              >
                {currentQuestion.options.find((o) => o.id === selectedAnswer)
                  ?.correct
                  ? "Correct! "
                  : "Incorrect! "}
                {currentQuestion.fact}
              </Alert>

              {!showNextQuestion && currentQuestionIndex === 0 && (
                <Button variant="primary" onClick={handleNextQuestion}>
                  Next Question
                </Button>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizStart;
