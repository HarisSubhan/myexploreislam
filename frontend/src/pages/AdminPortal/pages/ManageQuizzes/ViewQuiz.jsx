import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../AdminApp";
import { Spinner, Card, ListGroup, Alert } from "react-bootstrap";
import { getQuizByIdApi } from "../../../../services/quizApi";
import { getVideoByIdApi } from "../../../../services/videoApi";

const ViewQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const quizData = await getQuizByIdApi(id);
        setQuiz(quizData);

        // Agar video linked hai to title lao
        if (quizData?.video_id) {
          try {
            const videoRes = await getVideoByIdApi(quizData.video_id);
            setVideoTitle(videoRes?.title || "Untitled Video");
          } catch (err) {
            console.error("Error fetching video:", err);
            setVideoTitle("Error loading video");
          }
        } else {
          setVideoTitle("No video linked");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Alert variant="danger">{error}</Alert>
        </div>
      </AdminLayout>
    );
  }

  if (!quiz) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <p className="text-danger">Quiz not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-3">View Quiz</h2>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{quiz.title}</Card.Title>
            <Card.Text>
              <strong>Related Video:</strong> {videoTitle}
              <br />
              <strong>Created At:</strong>{" "}
              {quiz.created_at
                ? new Date(quiz.created_at).toLocaleDateString()
                : "N/A"}
            </Card.Text>
          </Card.Body>
        </Card>

        <h4>Questions:</h4>
        <ListGroup>
          {quiz.questions?.length > 0 ? (
            quiz.questions.map((q, idx) => {
              // options ko array banate hain
              const options = [
                { key: "A", text: q.option_a },
                { key: "B", text: q.option_b },
                { key: "C", text: q.option_c },
                { key: "D", text: q.option_d },
              ];

              return (
                <ListGroup.Item key={q.id || idx}>
                  <strong>Q{idx + 1}:</strong> {q.question}
                  <br />
                  <strong>Options:</strong>{" "}
                  {options.map((opt, i) => (
                    <span
                      key={i}
                      className={
                        opt.key === q.correct_option
                          ? "text-success fw-bold"
                          : ""
                      }
                    >
                      {opt.text}
                      {i < options.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  <br />
                  <strong>Correct Answer:</strong>{" "}
                  {
                    options.find((o) => o.key === q.correct_option)?.text ||
                    "N/A"
                  }
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item>No questions available</ListGroup.Item>
          )}
        </ListGroup>
      </div>
    </AdminLayout>
  );
};

export default ViewQuiz;

