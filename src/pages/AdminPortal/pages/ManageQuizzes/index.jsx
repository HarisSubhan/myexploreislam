import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";

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
    const [quizzes, setQuizzes] = useState(dummyQuizzes);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    const handleDeleteConfirm = (id) => {
        setSelectedQuizId(id);
        setShowModal(true);
    };

    const deleteQuiz = () => {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuizId));
        setShowModal(false);
        setSelectedQuizId(null);
    };
    return (
        <AdminLayout>
            <div className="p-4">
                <h2 className="mb-4">📝 Manage Quizzes</h2>

                <Link to="/admin/manage-quizzes/add">
                    <Button variant="success" className="mb-3">➕ Add Quiz</Button>
                </Link>

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
                                    <Link to={`/admin/manage-quizzes/view/${quiz.id}`}>
                                        <Button variant="info" size="sm" className="me-2">
                                            View
                                        </Button>
                                    </Link>

                                    <Link to={`/admin/manage-quizzes/edit/${quiz.id}`}>
                                        <Button variant="warning" size="sm" className="me-2">
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button variant="danger" size="sm" onClick={() => handleDeleteConfirm(quiz.id)}>
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
