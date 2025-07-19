import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner, ListGroup } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

const ViewAssignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    // Dummy data – replace with real fetch logic
    const fetched = {
      id,
      title: "Assignment on Prayer",
      description: "Write 5 benefits of Salah.",
      category: "Prayer",
      video: "Why Salah is important",
      dueDate: "2025-06-30",
    };
    setAssignment(fetched);
  }, [id]);

  if (!assignment) {
    return (
      <AdminLayout>
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="m-4 p-4">
        <h2>📄 View Assignment</h2>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Title:</strong> {assignment.title}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Description:</strong> {assignment.description}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Category:</strong> {assignment.category}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Related Video:</strong> {assignment.video}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Due Date:</strong> {assignment.dueDate}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </AdminLayout>
  );
};

export default ViewAssignment;
