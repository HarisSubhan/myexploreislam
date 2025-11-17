import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Modal,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useAppContext } from "../../../context/AppContext";
import { createTicketApi, getTicketsApi } from "../../../services/ticketApi";
import { FaPlusCircle, FaTicketAlt } from "react-icons/fa";

const ParentSupports = () => {
  const { user } = useAppContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const userId = user?._id;

  // === Fetch Tickets ===
  const fetchTickets = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getTicketsApi(userId);
      setTickets(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  // === Create Ticket ===
  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in both fields before submitting.");
      return;
    }

    setCreating(true);
    try {
      await createTicketApi({ userId, subject, message });
      setSubject("");
      setMessage("");
      setShowModal(false);
      fetchTickets();
      setError("");
    } catch (err) {
      console.error("Create error:", err);
      setError("Failed to create a ticket. Try again.");
    } finally {
      setCreating(false);
    }
  };

  // === Ticket Stats ===
  const total = tickets.length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const pending = tickets.filter((t) => t.status === "pending").length;

  // === UI ===
  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FaTicketAlt className="me-2 text-primary" />
            My Support Tickets
          </h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlusCircle className="me-1" /> New Ticket
          </Button>
        </Card.Body>
      </Card>

      {/* === Stats Summary === */}
      <div className="row text-center mb-3">
        <div className="col-md-4">
          <Card className="p-3 border-0 shadow-sm bg-light">
            <h6>Total Tickets</h6>
            <h3>{total}</h3>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="p-3 border-0 shadow-sm bg-light">
            <h6>Pending</h6>
            <h3 className="text-warning">{pending}</h3>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="p-3 border-0 shadow-sm bg-light">
            <h6>Resolved</h6>
            <h3 className="text-success">{resolved}</h3>
          </Card>
        </div>
      </div>

      {/* === Error Message === */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* === Ticket Table === */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No support tickets found.</p>
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            Create One Now
          </Button>
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id || index}>
                <td>{index + 1}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.message}</td>
                <td>
                  <span
                    className={`badge ${
                      ticket.status === "resolved"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {ticket.status || "pending"}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* === New Ticket Modal === */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit New Support Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your issue"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateTicket}
            disabled={creating}
          >
            {creating ? (
              <>
                <Spinner animation="border" size="sm" /> Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ParentSupports;
