import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/quizzes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes", err);
        setLoading(false);
      });
  }, []);

  const handleDeleteConfirm = (id) => {
    setSelectedQuizId(id);
    setShowModal(true);
  };

  const deleteQuiz = () => {
    axios
      .delete(`/api/quizzes/${selectedQuizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuizId));
        setShowModal(false);
        setSelectedQuizId(null);
      })
      .catch((err) => {
        console.error("Failed to delete quiz", err);
        setShowModal(false);
      });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📝 Manage Quizzes</h2>

        <Link to="/admin/manage-quizzes/add">
          <Button variant="success" className="mb-3">➕ Add Quiz</Button>
        </Link>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Total Questions</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz.id}>
                  <td>{index + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{quiz.category}</td>
                  <td>{quiz.questionCount}</td>
                  <td>{new Date(quiz.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/manage-quizzes/view/${quiz.id}`}>
                      <Button variant="info" size="sm" className="me-2">View</Button>
                    </Link>

                    <Link to={`/admin/manage-quizzes/edit/${quiz.id}`}>
                      <Button variant="warning" size="sm" className="me-2">Edit</Button>
                    </Link>

                    <Button variant="danger" size="sm" onClick={() => handleDeleteConfirm(quiz.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Confirm Delete Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this quiz?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteQuiz}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageQuizzes;
