import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

const TopPerformingStudents = () => {
  // Dummy data — baad mein isay backend API se replace kar sakte hain
  const topStudents = [
    { name: "Ali Khan", score: 95 },
    { name: "Ayesha Noor", score: 92 },
    { name: "Zaid Malik", score: 89 },
    { name: "Fatima Shah", score: 88 },
    { name: "Usman Tariq", score: 85 },
  ];

  return (
    <Card className="shadow-sm border-0 mb-4" style={{ width: '100%' }}>
      <Card.Body>
        <h5 className="mb-3">Top Performing Students</h5>
        <ListGroup variant="flush">
          {topStudents.map((student, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{index + 1}. {student.name}</span>
              <Badge bg="success" pill>{student.score}%</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default TopPerformingStudents;
