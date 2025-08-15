import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { requestChildApi } from "../../services/parentApi";

const RequestChild = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedChildren, setRequestedChildren] = useState("");
  const parentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`/api/requests/${parentId}`);
        setRequests(res.data);
      } catch (err) {
        toast.error("Failed to load requests.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedChildren || Number(requestedChildren) <= 0) {
      toast.error("Please enter a valid number of children.");
      return;
    }

    try {
      const newRequest = await requestChildApi({
        parent_id: parentId,
        requested_children: Number(requestedChildren),
      });

      setRequests((prev) => [...prev, newRequest]);
      toast.success("Request submitted successfully.");
      setRequestedChildren("");
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error); // backend error
      } else {
        toast.error(err.message || "Failed to send request.");
      }
      console.error(err);
    }
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

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-muted">No requests yet.</p>
      ) : (
        <Row>
          {requests.map((req) => (
            <Col md={6} lg={4} key={req._id} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{req.requested_children} Children</Card.Title>
                  <Card.Text>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        req.status === "pending"
                          ? "text-warning"
                          : req.status === "approved"
                            ? "text-success"
                            : "text-danger"
                      }
                    >
                      {req.status}
                    </span>
                  </Card.Text>
                  <small className="text-muted">
                    {new Date(req.created_at).toLocaleString()}
                  </small>
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
