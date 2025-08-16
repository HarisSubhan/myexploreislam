import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, ListGroup, Spinner, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { createQuizApi } from "../../../../services/quizApi";
import { getAllVideosApi } from "../../../../services/videoApi"; // Make sure this API exists

const AddQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [videos, setVideos] = useState([]); // Safe default array
  const [selectedVideo, setSelectedVideo] = useState("");
  const [questions, setQuestions] = useState([{
    question: "",
    options: ["", "", "", ""],
    correct: "",
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await getAllVideosApi(token);
        console.log("Videos API response:", response);

        if (response && Array.isArray(response)) {
          setVideos(response);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correct") {
      updatedQuestions[index].correct = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: "" },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedVideo) {
      setError("Please select a video for this quiz");
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      correct_option: q.correct,
    }));

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await createQuizApi({
        title: quizTitle,
        video_id: selectedVideo,
        questions: formattedQuestions,
      }, token);

      setSuccess(true);
      setQuizTitle("");
      setSelectedVideo("");
      setQuestions([{ question: "", options: ["", "", "", ""], correct: "" }]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
      console.error("Quiz creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">Create New Quiz</h2>

        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Quiz created successfully!
        </Alert>}

        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Quiz Title</Form.Label>
                <Form.Control
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Select Video</Form.Label>
                <Form.Select
                  value={selectedVideo}
                  onChange={(e) => setSelectedVideo(e.target.value)}
                  required
                >
                  <option value="">-- Select a video --</option>
                  {loading ? (
                    <option disabled>Loading videos...</option>
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>No videos available</option>
                  )}
                </Form.Select>
              </Form.Group>

              <h5 className="mt-4 mb-3">Quiz Questions</h5>
              
              {questions.map((q, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Question {index + 1}</h6>
                      {questions.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                        placeholder="Enter question text"
                        required
                      />
                    </Form.Group>

                    <Row>
                      {q.options.map((opt, i) => (
                        <Col md={6} key={i} className="mb-3">
                          <Form.Group>
                            <div className="d-flex align-items-center">
                              <span className="me-2 fw-bold">{String.fromCharCode(65 + i)}</span>
                              <Form.Control
                                type="text"
                                value={opt}
                                onChange={(e) => handleQuestionChange(index, `option${i}`, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>

                    <Form.Group>
                      <Form.Label>Correct Answer</Form.Label>
                      <Form.Select
                        value={q.correct}
                        onChange={(e) => handleQuestionChange(index, "correct", e.target.value)}
                        required
                      >
                        <option value="">Select correct option</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-primary" 
                  onClick={addQuestion}
                  className="mb-3"
                >
                  ➕ Add Question
                </Button>
                
                <Button 
                  variant="success" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Creating...</span>
                    </>
                  ) : (
                    "✅ Create Quiz"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddQuiz;
