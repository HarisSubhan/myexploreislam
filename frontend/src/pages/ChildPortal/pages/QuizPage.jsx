import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizApi } from '../../../services/quizApi';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';
import { 
  EmojiLaughing, 
  EmojiFrown, 
  JournalBookmark, 
  RocketTakeoff,
  Lightbulb,
  Clock
} from 'react-bootstrap-icons';



const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizApi();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Oops! Couldn't load the fun quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handlePlayQuiz = (quizId) => {
    navigate(`${quizId}`);
  };

  if (loading) {
    return (
      <Container className="text-center py-5 loading-container">
        <Spinner animation="grow" variant="primary" />
        <h2 className="mt-3">
          <EmojiLaughing className="me-2" />
          Loading your fun quiz...
        </h2>
        <p className="text-muted">Getting everything ready for your brain adventure!</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5 error-container">
        <Alert variant="danger" className="shadow">
          <h2>
            <EmojiFrown className="me-2" />
            Oh no!
          </h2>
          <p>{error}</p>
          <Button 
            variant="outline-danger" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Container className="text-center py-5 empty-container">
        <div className="empty-state p-4 rounded shadow">
          <JournalBookmark size={48} className="text-primary mb-3" />
          <h2>No Quizzes Yet!</h2>
          <p className="lead">Come back soon for more brainy fun!</p>
          <Button variant="outline-primary" className="mt-3">
            Check Later
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="quiz-page py-4">
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="display-4 page-title">
            <Lightbulb className="me-2 text-warning" />
            Let's Play Some Quizzes!
            <RocketTakeoff className="ms-2 text-danger" />
          </h1>
          <p className="lead text-muted">Choose a quiz and start your learning adventure!</p>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {quizzes.map((quiz) => (
          <Col key={quiz.id}>
            <Card className="h-100 quiz-card shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="quiz-title">
                  {quiz.title}
                </Card.Title>
                <Card.Text className="flex-grow-1 quiz-description">
                  {quiz.description || "This one's a mystery quiz! Can you solve it?"}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge pill bg="info" className="quiz-category">
                    <JournalBookmark className="me-1" />
                    {quiz.category}
                  </Badge>
                  <Button 
                    variant="success" 
                    onClick={() => handlePlayQuiz(quiz.id)}
                    className="play-button"
                  >
                    <RocketTakeoff className="me-1" />
                    Play Now
                  </Button>
                </div>
              </Card.Body>
              {quiz.duration && (
                <Card.Footer className="text-muted small">
                  <Clock className="me-1" />
                  {quiz.duration} min quiz
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizPage;