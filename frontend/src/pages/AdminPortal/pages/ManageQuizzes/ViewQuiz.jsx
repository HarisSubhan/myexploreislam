import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../AdminApp";
import { Spinner, Card, ListGroup } from "react-bootstrap";

const ViewQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy fetch simulation (replace with real API call)
    const fetchQuiz = async () => {
      setLoading(true);
      // Simulated quiz data
      const dummyQuiz = {
        id,
        title: "Pillars of Islam",
        relatedVideo: "What is Islam?",
        relatedCategory: "Aqidah",
        questions: [
          {
            question: "How many pillars of Islam are there?",
            options: ["Three", "Five", "Seven", "Ten"],
            correctAnswer: "Five",
          },
          {
            question: "Which one is the first pillar?",
            options: ["Zakat", "Hajj", "Shahada", "Salah"],
            correctAnswer: "Shahada",
          },
        ],
      };

      setQuiz(dummyQuiz);
      setLoading(false);
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="danger" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-3">📋 View Quiz</h2>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{quiz.title}</Card.Title>
            <Card.Text>
              <strong>Related Video:</strong> {quiz.relatedVideo}
              <br />
              <strong>Related Category:</strong> {quiz.relatedCategory}
            </Card.Text>
          </Card.Body>
        </Card>

        <h4>Questions:</h4>
        <ListGroup>
          {quiz.questions.map((q, idx) => (
            <ListGroup.Item key={idx}>
              <strong>Q{idx + 1}:</strong> {q.question}
              <br />
              <strong>Options:</strong>{" "}
              {q.options.map((opt, i) => (
                <span key={i} className={opt === q.correctAnswer ? "text-success fw-bold" : ""}>
                  {opt}{i < q.options.length - 1 ? ", " : ""}
                </span>
              ))}
              <br />
              <strong>Correct Answer:</strong> {q.correctAnswer}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </AdminLayout>
  );
};

export default ViewQuiz;
