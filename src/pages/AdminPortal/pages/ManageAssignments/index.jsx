import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/assignments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) => {
      setAssignments(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch assignments", err);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this assignment?");
    if (confirm) {
      axios.delete(`/api/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        setAssignments(assignments.filter((a) => a.id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete assignment", err);
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📚 Manage Assignments</h2>

        <Link to="/admin/manage-assignments/add" className="btn btn-success mb-3">
          ➕ Add Assignment
        </Link>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Assignment Title</th>
                <th>Category</th>
                <th>Uploaded On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={assignment.id}>
                  <td>{index + 1}</td>
                  <td>{assignment.title}</td>
                  <td>{assignment.category}</td>
                  <td>{new Date(assignment.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/admin/manage-assignments/view/${assignment.id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/manage-assignments/edit/${assignment.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageAssignments;
