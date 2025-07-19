import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ProgressBar,
  Form,
  Spinner,
  Alert,
  Image,
} from 'react-bootstrap';
import { getQuizByIdApi, submitQuizApi } from '../../services/quizApi';
import './VideoThumbnails.css';

const QuizStart = () => {
  const { quizid } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Fetch quiz data once on mount or when quizid changes
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await getQuizByIdApi(quizid);
        const transformedData = {
          ...data,
          questions: data.questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: [
              { id: 'A', text: q.option_a, correct: q.correct_option === 'A' },
              { id: 'B', text: q.option_b, correct: q.correct_option === 'B' },
              { id: 'C', text: q.option_c, correct: q.correct_option === 'C' },
              { id: 'D', text: q.option_d, correct: q.correct_option === 'D' },
            ],
            image: q.image || null,
            fact: q.fact || '',
          })),
        };
        setQuizData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizid]);

  // Submit quiz answers to API
  const submitQuizResults = async () => {
    if (!quizData) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const childData = JSON.parse(localStorage.getItem('childData'));
      const childId = childData?.id || 5;

      const answers = quizData.questions.map((question) => ({
        question_id: question.id,
        selected_option: userAnswers[question.id] || null,
      }));

      const submissionData = {
        quiz_id: parseInt(quizid, 10),
        child_id: childId,
        score,
        answers,
      };

      const response = await submitQuizApi(submissionData);
      console.log('✅ Quiz submitted successfully:', response.status);
    } catch (err) {
      console.error('Error submitting quiz results:', err);
      setSubmissionError(
        err.response?.data?.message || err.message || 'Failed to save your results. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle answer selection (only when answer not submitted yet)
  const handleAnswerSelect = (answerId) => {
    if (!showResult && !quizCompleted) {
      setSelectedAnswer(answerId);
    }
  };

  // Handle "Check Answer" click
  const handleSubmit = () => {
    if (!quizData) return;

    const current = quizData.questions[currentQuestionIndex];
    const isCorrect = current.options.find((opt) => opt.id === selectedAnswer)?.correct;

    if (isCorrect) setScore((prev) => prev + 1);

    setUserAnswers((prev) => ({
      ...prev,
      [current.id]: selectedAnswer,
    }));

    setShowResult(true);
  };

  // Handle "Next Question" or "See Results" click
  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      submitQuizResults();
    }
  };

  // Handle "Previous" click
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Restart the quiz to initial state
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setScore(0);
    setUserAnswers({});
    setEmail('');
    setIsSubscribed(false);
    setSubmissionError(null);
  };

  // Handle email subscription form submit
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail('');
  };

  // Render loading spinner
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="grow" variant="primary" />
        <h3 className="mt-3" style={{ color: '#4a6baf' }}>
          Loading your quiz...
        </h3>
      </Container>
    );
  }

  // Render error message if fetch failed
  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger" className="rounded-pill">
          <Alert.Heading>Oops! Something went wrong</Alert.Heading>
          <p>{error}</p>
          <Button variant="warning" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!quizData) return null;

  // Render results screen after quiz completion
  if (quizCompleted) {
    const percentage = Math.round((score / quizData.questions.length) * 100);

    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Card
          className="text-center p-4 border-0 shadow"
          style={{ maxWidth: '500px', backgroundColor: '#f8f9fa', borderRadius: '20px' }}
        >
          <Card.Body>
            <div className="mb-4">
              <h2 style={{ color: '#4a6baf' }}>🎉 Quiz Completed!</h2>
              <div className="mt-3 mb-4">
                <div className="display-4" style={{ color: '#4a6baf' }}>
                  {score}
                </div>
                <div className="text-muted">out of {quizData.questions.length}</div>
                <div className="mt-2 h5">
                  <strong>Score:</strong> {percentage}%
                </div>
                <ProgressBar
                  now={percentage}
                  variant={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}
                  className="mt-2"
                  style={{ height: 10, borderRadius: 5 }}
                />
              </div>
            </div>

            {submissionError && (
              <Alert variant="danger" className="rounded-pill">
                <Alert.Heading>Submission Error</Alert.Heading>
                <p>{submissionError}</p>
                <div className="d-flex justify-content-center mt-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={submitQuizResults}
                    disabled={isSubmitting}
                    className="rounded-pill px-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Retrying...
                      </>
                    ) : (
                      'Retry Submission'
                    )}
                  </Button>
                </div>
              </Alert>
            )}

            {!isSubscribed ? (
              <Form onSubmit={handleEmailSubmit} className="mb-4">
                <h5 className="mb-3" style={{ color: '#4a6baf' }}>
                  Want more fun quizzes?
                </h5>
                <div className="d-flex">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-pill me-2"
                    style={{ height: 50 }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-pill px-4"
                    style={{ height: 50, backgroundColor: '#4a6baf', borderColor: '#4a6baf' }}
                    disabled={isSubmitting}
                  >
                    Subscribe
                  </Button>
                </div>
              </Form>
            ) : (
              <Alert variant="success" className="rounded-pill">
                <span className="h5">🎉 Thanks for subscribing!</span>
              </Alert>
            )}

            <div className="d-grid gap-3 mt-4">
              <Button
                variant="primary"
                onClick={restartQuiz}
                className="rounded-pill py-2"
                style={{ backgroundColor: '#4a6baf', borderColor: '#4a6baf' }}
                disabled={isSubmitting}
              >
                Play Again
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/child/quiz')}
                className="rounded-pill py-2"
                style={{ color: '#4a6baf', borderColor: '#4a6baf' }}
                disabled={isSubmitting}
              >
                More Quizzes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Render quiz questions screen
  const current = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const isCorrect = selectedAnswer && current.options.find((opt) => opt.id === selectedAnswer)?.correct;

  return (
    <Container className="mt-4" style={{ maxWidth: 800 }}>
      <div className="mb-4 text-center">
        <h3 style={{ color: '#4a6baf' }}>{quizData.title}</h3>
        <div className="d-flex align-items-center mt-3">
          <ProgressBar now={progress} style={{ height: 15, width: '100%', borderRadius: 10 }} variant="info" />
          <span className="ms-3 fw-bold" style={{ color: '#4a6baf' }}>
            Q{currentQuestionIndex + 1}/{quizData.questions.length}
          </span>
        </div>
      </div>

      <Card className="border-0 shadow-sm" style={{ borderRadius: 15 }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-4 h4" style={{ color: '#4a6baf' }}>
            {current.question}
          </Card.Title>

          <Row className="g-4">
            <Col md={6}>
              <div className="d-grid gap-3">
                {current.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline-primary"
                    className={`text-start py-3 rounded-pill option-button ${
                      selectedAnswer === option.id ? 'selected' : ''
                    } ${
                      showResult
                        ? option.correct
                          ? 'correct-answer'
                          : selectedAnswer === option.id
                          ? 'incorrect-answer'
                          : ''
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(option.id)}
                    style={{
                      borderWidth: 2,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s',
                    }}
                    disabled={showResult || quizCompleted}
                  >
                    <span className="fw-bold me-2">{option.id}.</span> {option.text}
                  </Button>
                ))}
              </div>
            </Col>

            <Col md={6} className="d-flex align-items-center justify-content-center">
              {current.image && (
                <Image
                  src={current.image}
                  alt="question"
                  fluid
                  className="rounded shadow-sm"
                  style={{ maxHeight: 300, objectFit: 'contain' }}
                />
              )}
            </Col>
          </Row>

          {showResult && (
            <div className={`mt-4 p-3 rounded ${isCorrect ? 'bg-success-light' : 'bg-danger-light'}`}>
              <div className="d-flex align-items-center">
                <span className={`fs-1 me-3 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div>
                  <h5 className={isCorrect ? 'text-success' : 'text-danger'}>{isCorrect ? 'Great Job!' : 'Oops!'}</h5>
                  <p className="mb-0">{current.fact}</p>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between mt-5">
            <Button
              variant="outline-secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="rounded-pill px-4 py-2"
            >
              ← Previous
            </Button>

            {!showResult ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="rounded-pill px-4 py-2"
                style={{ backgroundColor: '#4a6baf', borderColor: '#4a6baf' }}
              >
                Check Answer
              </Button>
            ) : (
              <Button variant="success" onClick={handleNextQuestion} className="rounded-pill px-4 py-2">
                {currentQuestionIndex === quizData.questions.length - 1 ? 'See Results →' : 'Next Question →'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizStart;
