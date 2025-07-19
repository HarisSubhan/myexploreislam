import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, ListGroup, Spinner, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { createQuizApi } from "../../../../services/quizApi";
import {getCategoriesApi} from "../../../../services/categoryApi";

const AddQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questions, setQuestions] = useState([{
    question: "",
    options: ["", "", "", ""],
    correct: "",
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await getCategoriesApi(token);
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
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
        linked_categories: selectedCategories,
        questions: formattedQuestions,
      }, token);
      
      setSuccess(true);
      // Reset form
      setQuizTitle("");
      setSelectedCategories([]);
      setQuestions([{
        question: "",
        options: ["", "", "", ""],
        correct: "",
      }]);
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
        <h2 className="mb-4">📝 Create New Quiz</h2>
        
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
                <Form.Label>Select Categories</Form.Label>
                <Card>
                  <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {loading ? (
                      <div className="text-center py-3">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : categories.length > 0 ? (
                      <ListGroup variant="flush">
                        {categories.map((category) => (
                          <ListGroup.Item key={category.id} className="px-0 py-2">
                            <Form.Check
                              type="checkbox"
                              id={`category-${category.id}`}
                              label={category.name}
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                            />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-muted">No categories available</div>
                    )}
                  </Card.Body>
                </Card>
                <Form.Text className="text-muted">
                  {selectedCategories.length > 0 
                    ? `${selectedCategories.length} categories selected` 
                    : "Select at least one category"}
                </Form.Text>
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