import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";
import { getQuizByIdApi, updateQuizApi } from "../../../../services/quizApi";

const EditQuiz = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await getQuizByIdApi(id);
        setQuizData(quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuizApi(id, quizData);
      alert("Quiz updated successfully");
    } catch (err) {
      console.error("Error updating quiz:", err);
      alert("Failed to update quiz");
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quizData) return <p>No quiz found</p>;

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">Edit Quiz</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              value={quizData.title}
              onChange={(e) =>
                setQuizData({ ...quizData, title: e.target.value })
              }
              required
            />
          </Form.Group>

          {quizData.questions.map((q, index) => (
            <Card key={q.id || index} className="mb-3">
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Option A</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.option_a}
                    onChange={(e) =>
                      handleQuestionChange(index, "option_a", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Option B</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.option_b}
                    onChange={(e) =>
                      handleQuestionChange(index, "option_b", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Option C</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.option_c}
                    onChange={(e) =>
                      handleQuestionChange(index, "option_c", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Option D</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.option_d}
                    onChange={(e) =>
                      handleQuestionChange(index, "option_d", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Correct Option</Form.Label>
                  <Form.Select
                    value={q.correct_option}
                    onChange={(e) =>
                      handleQuestionChange(index, "correct_option", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Correct Option</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}

          <Button variant="primary" type="submit">
            Update Quiz
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditQuiz;
