import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";
import { getAssignmentById } from "../../services/assignmentApi";


const AssignmentsStart = () => {
  const { id } = useParams(); // Assuming route like /assignments/:id
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignmentById(id);
        setAssignment(data);
      } catch (err) {
        setError("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading assignment...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <h3 className="mb-3 d-flex align-items-center gap-2">
          <BsClipboardCheck />
          {assignment.title}
        </h3>
        <Row className="mb-3">
          <Col md={6}>
            <Badge bg="info" className="me-2">
              {assignment.category}
            </Badge>
            <Badge bg="warning" className="me-2">
              <FiCalendar className="me-1" />
              {assignment.due_date?.slice(0, 10)}
            </Badge>
            <Badge bg="success">{assignment.points || 10} pts</Badge>
          </Col>
        </Row>
        <p className="text-muted mb-4">{assignment.description}</p>

        <Button
          href={assignment.file_url}
          target="_blank"
          variant="primary"
          className="me-2"
        >
          <FiDownload className="me-2" />
          Download Assignment
        </Button>

        {/* Optional: File submission UI */}
        {/* You can build upload logic here if needed */}
      </Card>
    </Container>
  );
};

export default AssignmentsStart;
