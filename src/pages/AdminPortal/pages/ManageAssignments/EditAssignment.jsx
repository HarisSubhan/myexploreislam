import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AdminLayout from "../../AdminApp";

const EditAssignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    // Dummy data load — replace with actual API call
    const fetched = {
      id,
      title: "Edit Me",
      description: "This is the current assignment description.",
      category: "Prayer",
      video: "Intro to Islam",
      dueDate: "2025-06-15",
    };
    setAssignment(fetched);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // PUT request yahan karo
    alert("Assignment updated successfully!");
  };

  if (!assignment) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="m-4 p-4">
        <h2>✏️ Edit Assignment</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={assignment.title}
              onChange={(e) =>
                setAssignment({ ...assignment, title: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={assignment.description}
              onChange={(e) =>
                setAssignment({ ...assignment, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={assignment.category}
              onChange={(e) =>
                setAssignment({ ...assignment, category: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Related Video</Form.Label>
            <Form.Control
              type="text"
              value={assignment.video}
              onChange={(e) =>
                setAssignment({ ...assignment, video: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={assignment.dueDate}
              onChange={(e) =>
                setAssignment({ ...assignment, dueDate: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default EditAssignment;
