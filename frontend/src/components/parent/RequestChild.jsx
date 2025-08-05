import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import { requestChildApi } from '../../services/parentApi'; 

const RequestChild = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedChild, setRequestedChild] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const parentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`/api/requests/${parentId}`);
        setRequests(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!requestedChild.trim()) {
      setError('Child Name is required');
      return;
    }

    try {
      const newRequest = await requestChildApi({
        parent_id: parentId,
        requested_children: requestedChild,
      });

      setRequests((prev) => [...prev, newRequest]);
      setSuccess('Request sent successfully!');
      setRequestedChild('');
    } catch (err) {
      setError(err.message || 'Failed to send request.');
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="mb-4">Request a Child</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="requestedChild" className="mb-3">
            <Form.Label>Child Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter child Name"
              value={requestedChild}
              onChange={(e) => setRequestedChild(e.target.value)}
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
        <Alert variant="info">No requests yet.</Alert>
      ) : (
        <Row>
          {requests.map((req) => (
            <Col md={6} lg={4} key={req._id} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{req.requested_children}</Card.Title>
                  <Card.Text>
                    <strong>Status:</strong>{' '}
                    <span
                      className={
                        req.status === 'pending'
                          ? 'text-warning'
                          : req.status === 'approved'
                          ? 'text-success'
                          : 'text-danger'
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
