import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const dummyQuizzes = [
  {
    id: 1,
    title: "Basic Pillars of Islam",
    category: "Aqidah",
    questions: 10,
    createdBy: "Admin",
  },
  {
    id: 2,
    title: "Prophets Quiz",
    category: "Stories",
    questions: 8,
    createdBy: "Admin",
  },
  {
    id: 3,
    title: "Fasting Rules",
    category: "Fiqh",
    questions: 12,
    createdBy: "Admin",
  },
];

const ManageQuizzes = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📝 Manage Quizzes</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz Title</th>
              <th>Category</th>
              <th>Total Questions</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyQuizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.category}</td>
                <td>{quiz.questions}</td>
                <td>{quiz.createdBy}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    View
                  </Button>
                  <Button variant="warning" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageQuizzes;
