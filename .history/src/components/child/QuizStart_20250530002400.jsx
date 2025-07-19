import React, { useState } from "react";
import { Container, Card, ListGroup, Button, Alert } from "react-bootstrap";

const QuizStart = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  

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
