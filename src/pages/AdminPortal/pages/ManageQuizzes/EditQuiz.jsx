import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";

// Dummy data to simulate fetching existing quiz
const dummyQuiz = {
  id: 1,
  title: "Islamic Basics Quiz",
  linkTo: "Video",
  linkedItem: "1",
  questions: [
    {
      question: "What is the first pillar of Islam?",
      options: ["Shahadah", "Salah", "Zakah", "Hajj"],
      correctAnswer: "Shahadah",
    },
    {
      question: "Who is the last Prophet?",
      options: ["Musa", "Isa", "Ibrahim", "Muhammad"],
      correctAnswer: "Muhammad",
    },
  ],
};

const EditQuiz = () => {
  const { id } = useParams(); // id from route
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Simulate fetching quiz by id
    setQuizData(dummyQuiz); // In real case, fetch from backend using `id`
  }, [id]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedOptions = [...quizData.questions[qIndex].options];
    updatedOptions[oIndex] = value;
    handleQuestionChange(qIndex, "options", updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Quiz:", quizData);
    // TODO: Send to backend using PUT / PATCH
  };

  if (!quizData) return <p>Loading quiz...</p>;

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">✏️ Edit Quiz</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link To</Form.Label>
            <Form.Select
              value={quizData.linkTo}
              onChange={(e) => setQuizData({ ...quizData, linkTo: e.target.value })}
            >
              <option value="Video">Video</option>
              <option value="Category">Category</option>
              <option value="Assignment">Assignment</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select {quizData.linkTo}</Form.Label>
            <Form.Control
              type="text"
              value={quizData.linkedItem}
              onChange={(e) => setQuizData({ ...quizData, linkedItem: e.target.value })}
            />
          </Form.Group>

          {quizData.questions.map((q, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                    required
                  />
                </Form.Group>

                {q.options.map((option, oIndex) => (
                  <Form.Group key={oIndex} className="mb-2">
                    <Form.Label>Option {oIndex + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                      required
                    />
                  </Form.Group>
                ))}

                <Form.Group className="mb-2">
                  <Form.Label>Correct Answer</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                    required
                  />
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
