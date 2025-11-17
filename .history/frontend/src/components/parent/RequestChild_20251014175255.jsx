import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import {
  requestedChildApi,
  getChildRequestsApi,
} from "../../services/parentApi"; // Add get function

const RequestChild = () => {
  const [requests, setRequests] = useState([]);
  const [requestedChildren, setRequestedChildren] = useState("");

  // Fetch existing requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // You'll need to implement this API function
      const existingRequests = await getChildRequestsApi();
      setRequests(existingRequests);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedChildren || Number(requestedChildren) <= 0) {
      toast.error("Please enter a valid number of children.");
      return;
    }

    try {
      // Remove parent_id from the call - backend should get it from token
      const newRequest = await requestedChildApi(Number(requestedChildren));

      setRequests((prev) => [...prev, newRequest]);
      setRequestedChildren("");
      toast.success("Request submitted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to send request.");
    }
  };

  const formatRequestDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="mb-4">Request Children</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="requestedChildren" className="mb-3">
            <Form.Label>Number of Children</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={requestedChildren}
              onChange={(e) => setRequestedChildren(e.target.value)}
              min="1"
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Send Request
          </Button>
        </Form>
      </Card>

      <h4 className="mt-5 mb-3">Sent Requests</h4>

      {requests.length === 0 ? (
        <p className="text-muted">No requests yet.</p>
      ) : (
        <Row>
          {requests.map((req, index) => (
            <Col
              md={6}
              lg={4}
              key={req.id || req._id || index}
              className="mb-3"
            >
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>
                    {req.requested_children || "-"} Children
                  </Card.Title>
                  <Card.Text>
                    <strong>Status:</strong> {req.status || "Pending"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Date Time:</strong>{" "}
                    {formatRequestDate(req.created_at || req.createdAt)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RequestChild;
