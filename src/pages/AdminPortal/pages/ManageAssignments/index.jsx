import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";

const dummyAssignments = [
    {
        id: 1,
        title: "Write about the 5 Pillars of Islam",
        category: "Aqidah",
        dueDate: "2025-06-05",
        createdBy: "Admin",
    },
    {
        id: 2,
        title: "Story of Prophet Musa (AS)",
        category: "Stories",
        dueDate: "2025-06-10",
        createdBy: "Admin",
    },
    {
        id: 3,
        title: "List rules of prayer",
        category: "Fiqh",
        dueDate: "2025-06-15",
        createdBy: "Admin",
    },
];

const ManageAssignments = () => {
    const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this assignment?");
        if (confirm) {
            alert(`Assignment ${id} deleted successfully.`);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4">
                <h2 className="mb-4">📚 Manage Assignments</h2>

                <Link to="/admin/manage-assignments/add" className="btn btn-success">
                    ➕ Add Assignment
                </Link>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Assignment Title</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyAssignments.map((assignment, index) => (
                            <tr key={assignment.id}>
                                <td>{index + 1}</td>
                                <td>{assignment.title}</td>
                                <td>{assignment.category}</td>
                                <td>{assignment.dueDate}</td>
                                <td>{assignment.createdBy}</td>
                                <td>
                                    <Link to={`/admin/manage-assignments/view/${assignment.id}`} className="btn btn-info btn-sm me-2">
                                        View
                                    </Link>

                                    <Link to={`/admin/manage-assignments/edit/${assignment.id}`} className="btn btn-warning btn-sm me-2">
                                        Edit
                                    </Link>

                                    <Button variant="danger" size="sm" onClick={() => handleDelete(assignment.id)}>
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

export default ManageAssignments;
