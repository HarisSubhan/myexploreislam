import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, Button, Spinner, Alert, Row, Col, 
  Accordion, Card, Form, ListGroup, Badge 
} from "react-bootstrap";
import { getVideoByIdApi } from "../../services/videoApi";
import { 
  FaPlay, FaHeart, FaShare, FaArrowLeft, 
  FaCheck, FaTimes, FaQuestionCircle, FaClipboardList 
} from "react-icons/fa";

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Mock quiz data - replace with your actual data
  const quizQuestions = [
    {
      id: 1,
      question: "What is the main concept discussed in this video?",
      options: [
        { id: 'a', text: "React Hooks" },
        { id: 'b', text: "State Management" },
        { id: 'c', text: "Component Lifecycle" },
        { id: 'd', text: "Context API" }
      ],
      correctAnswer: 'a'
    },
    {
      id: 2,
      question: "Which hook is used for side effects in React?",
      options: [
        { id: 'a', text: "useState" },
        { id: 'b', text: "useEffect" },
        { id: 'c', text: "useContext" },
        { id: 'd', text: "useReducer" }
      ],
      correctAnswer: 'b'
    }
  ];

  
  const assignment = {
    title: "React Hooks Practice",
    description: "Create a custom hook that fetches data from an API and handles loading/error states.",
    dueDate: "2023-12-15",
    points: 100
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getVideoByIdApi(videoId);
        
        if (!data) {
          throw new Error("Video data not found");
        }
        
        if (!data.video_url) {
          throw new Error("Video URL is missing");
        }

        const absoluteUrl = data.video_url.startsWith('http') 
          ? data.video_url 
          : `${window.location.origin}${data.video_url}`;
        
        setVideo({
          ...data,
          video_url: absoluteUrl
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (video?.video_url) {
      checkVideoPlayability();
    }
  }, [video?.video_url]);

  const checkVideoPlayability = async () => {
    try {
      const response = await fetch(video.video_url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('video/')) {
        throw new Error('Invalid video content type');
      }
      
      setVideoError(null);
    } catch (err) {
      console.error('Video playability check failed:', err);
      handleVideoError({ target: videoRef.current });
    }
  };

  const handleVideoError = (e) => {
    const videoElement = e?.target || videoRef.current;
    console.error("Video error details:", {
      error: videoElement?.error,
      networkState: videoElement?.networkState,
      readyState: videoElement?.readyState,
      src: videoElement?.src
    });
    
    setVideoError("Failed to load video. Please try again later.");
    
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 3000);
    }
  };

  const handleReload = () => {
    setRetryCount(0);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleQuizAnswer = (questionId, answerId) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleFileChange = (e) => {
    setAssignmentFile(e.target.files[0]);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    // Here you would typically upload the file to your backend
    console.log("Submitting assignment file:", assignmentFile);
    setAssignmentSubmitted(true);
    setAssignmentFile(null);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading video...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Error Loading Video</h4>
          <p>{error}</p>
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate(-1)}
          className="mt-3"
        >
          <FaArrowLeft className="me-2" />
          Back to Videos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <div className="ratio ratio-16x9 mb-4 bg-dark rounded overflow-hidden">
            {videoError ? (
              <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
                <Alert variant="danger" className="w-100 text-center">
                  {videoError}
                  {retryCount >= 3 && (
                    <div className="mt-2">Maximum retries reached</div>
                  )}
                </Alert>
                <Button 
                  variant="primary" 
                  onClick={handleReload}
                  className="mt-3"
                  disabled={retryCount >= 3}
                >
                  {retryCount < 3 ? 'Retry Now' : 'Retry Limit Reached'}
                </Button>
              </div>
            ) : (
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                playsInline
                controlsList="nodownload"
                poster={video.thumbnail_url}
                className="w-100 h-100 object-fit-cover"
                onError={handleVideoError}
                onCanPlay={() => setVideoError(null)}
              >
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}
          </div>

          <h1 className="mb-3">{video.title}</h1>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-muted">
              <span className="me-3">1.2M views</span>
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant={isFavorite ? "danger" : "outline-danger"} 
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <FaHeart className="me-1" />
                {isFavorite ? "Liked" : "Like"}
              </Button>
              <Button variant="outline-secondary">
                <FaShare className="me-1" />
                Share
              </Button>
            </div>
          </div>

          <div className="card p-3 mb-4">
            <h5>Description</h5>
            <p className="mb-0">{video.description}</p>
          </div>

          {/* Quiz Section */}
          <Accordion activeKey={activeAccordion} onSelect={(e) => setActiveAccordion(e)} className="mb-4">
            <Accordion.Item eventKey="quiz">
              <Accordion.Header>
                <FaQuestionCircle className="me-2 text-primary" />
                <span className="fw-bold">Take Quiz</span>
                {quizSubmitted && (
                  <Badge bg="success" className="ms-2">
                    Completed
                  </Badge>
                )}
              </Accordion.Header>
              <Accordion.Body>
                {quizSubmitted ? (
                  <div className="quiz-results">
                    <h5 className="text-center mb-4">
                      Your Score: {calculateQuizScore()}%
                    </h5>
                    {quizQuestions.map((q) => (
                      <div key={q.id} className="mb-4">
                        <h6 className="d-flex align-items-center">
                          {q.question}
                          {quizAnswers[q.id] === q.correctAnswer ? (
                            <FaCheck className="ms-2 text-success" />
                          ) : (
                            <FaTimes className="ms-2 text-danger" />
                          )}
                        </h6>
                        <ListGroup>
                          {q.options.map((opt) => (
                            <ListGroup.Item 
                              key={opt.id}
                              className={
                                quizAnswers[q.id] === opt.id && quizAnswers[q.id] !== q.correctAnswer
                                  ? 'list-group-item-danger'
                                  : opt.id === q.correctAnswer
                                  ? 'list-group-item-success'
                                  : ''
                              }
                            >
                              <Form.Check
                                type="radio"
                                id={`q${q.id}-${opt.id}`}
                                label={opt.text}
                                checked={quizAnswers[q.id] === opt.id}
                                readOnly
                              />
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button variant="outline-primary" onClick={handleQuizReset}>
                        Retake Quiz
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-4">Test your understanding of the video content with this short quiz.</p>
                    {quizQuestions.map((q) => (
                      <div key={q.id} className="mb-4">
                        <h6>{q.question}</h6>
                        <Form.Group>
                          {q.options.map((opt) => (
                            <Form.Check
                              key={opt.id}
                              type="radio"
                              id={`q${q.id}-${opt.id}`}
                              name={`question-${q.id}`}
                              label={opt.text}
                              checked={quizAnswers[q.id] === opt.id}
                              onChange={() => handleQuizAnswer(q.id, opt.id)}
                              className="mb-2"
                            />
                          ))}
                        </Form.Group>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button 
                        variant="primary" 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Assignment Section */}
          <Accordion activeKey={activeAccordion} onSelect={(e) => setActiveAccordion(e)}>
            <Accordion.Item eventKey="assignment">
              <Accordion.Header>
                <FaClipboardList className="me-2 text-primary" />
                <span className="fw-bold">Assignment</span>
                {assignmentSubmitted && (
                  <Badge bg="success" className="ms-2">
                    Submitted
                  </Badge>
                )}
              </Accordion.Header>
              <Accordion.Body>
                {assignmentSubmitted ? (
                  <div className="text-center">
                    <Alert variant="success" className="d-inline-flex align-items-center">
                      <FaCheck className="me-2" />
                      Your assignment has been submitted successfully!
                    </Alert>
                    <div className="mt-3">
                      <Button variant="outline-secondary" onClick={() => setAssignmentSubmitted(false)}>
                        Edit Submission
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h5>{assignment.title}</h5>
                    <p>{assignment.description}</p>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span className="text-muted">Points: {assignment.points}</span>
                    </div>
                    
                    <Form onSubmit={handleAssignmentSubmit}>
                      <Form.Group controlId="assignmentFile" className="mb-3">
                        <Form.Label>Upload your work</Form.Label>
                        <Form.Control 
                          type="file" 
                          onChange={handleFileChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Accepted formats: PDF, DOCX, PPTX, ZIP
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={!assignmentFile}
                        >
                          Submit Assignment
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        <Col lg={4}>
          <div className="card p-3 mb-4">
            <h5>More Videos</h5>
            <p className="text-muted">Suggested content will appear here</p>
          </div>
          
          <div className="card p-3">
            <h5>Learning Progress</h5>
            <div className="progress mb-2" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${quizSubmitted && assignmentSubmitted ? '100%' : quizSubmitted ? '50%' : assignmentSubmitted ? '50%' : '0%'}` }}
              >
                {quizSubmitted && assignmentSubmitted ? 'Complete!' : 'In Progress'}
              </div>
            </div>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Watch Video</span>
                <FaCheck className="text-success" />
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Complete Quiz</span>
                {quizSubmitted ? (
                  <FaCheck className="text-success" />
                ) : (
                  <Badge bg="warning" text="dark">Pending</Badge>
                )}
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Submit Assignment</span>
                {assignmentSubmitted ? (
                  <FaCheck className="text-success" />
                ) : (
                  <Badge bg="warning" text="dark">Pending</Badge>
                )}
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoDetail;